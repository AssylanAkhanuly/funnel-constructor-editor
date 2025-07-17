"use client";
import PageCard from "@/entities/page/ui/page-card";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import he from "he";
import parse from "html-react-parser";
import { useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { deleteQuizPage, updateQuizPageFrontmatter } from "../actions";
import { Page } from "../types";
import QuizPagesHeader from "./quiz-pages-header";

// Placeholder card for first/last order
function OrderPlaceholder({
  id,
  position,
  onDrop,
  isActive,
}: {
  id: string;
  position: "first" | "last";
  onDrop: () => void;
  isActive: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      id={id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-80 h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
        isActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
      }`}
      onClick={onDrop}
    >
      {position === "first" ? "Move to First Order" : "Move to Last Order"}
    </div>
  );
}

// Sortable PageCard wrapper
function SortablePageCard({
  page,
  onClick,
  id,
  selected,
  quizVersion,
  onDelete,
}: {
  page: Page;
  onClick: () => void;
  id: string;
  selected: boolean;
  quizVersion: string;
  onDelete?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      id={id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-80 ${selected ? "ring-2 ring-blue-500" : ""}`}
    >
      <PageCard
        page={{
          type: page.frontmatter.type,
          id: page.frontmatter.id,
          order: page.frontmatter.order,
        }}
        quizVersion={quizVersion}
        onClick={onClick}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function QuizPagesList({
  pages: initialPages,
  quizVersion,
}: {
  pages: Page[];
  quizVersion: string;
}) {
  const [pages, setPages] = useState<Page[]>([...initialPages]);
  const [selectedPage, setSelectedPage] = useState<null | Page>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverPlaceholder, setDragOverPlaceholder] = useState<
    null | "first" | "last"
  >(null);
  const pagesMap = new Map(pages.map((page) => [page.key, page]));
  const updateXarrow = useXarrow();

  // Group pages by order (vertical lanes)
  const groupedPages = (() => {
    const grouped = new Map<string, Page[]>();
    for (const page of pages) {
      const group = grouped.get(page.frontmatter.order);
      if (!group) {
        grouped.set(page.frontmatter.order, [page]);
      } else {
        group.push(page);
      }
    }
    // Sort groups by order
    return new Map(
      [...grouped.entries()].sort(([a], [b]) =>
        String(a).localeCompare(String(b), undefined, { numeric: true })
      )
    );
  })();

  // For DnD Kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Helper to get all page keys in order
  const getAllPageKeys = () => pages.map((p) => p.key);

  // Helper to get all group orders in order
  const getAllOrders = () => [...groupedPages.keys()];

  // Get first and last order values
  const allOrders = getAllOrders();
  const firstOrder = allOrders[0];
  const lastOrder = allOrders[allOrders.length - 1];

  // Drag start: highlight
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    setDragOverPlaceholder(null);
  }

  // Drag over: check if over placeholder
  function handleDragOver(event: any) {
    if (!event.over) {
      setDragOverPlaceholder(null);
      return;
    }
    if (event.over.id === "__first__") {
      setDragOverPlaceholder("first");
    } else if (event.over.id === "__last__") {
      setDragOverPlaceholder("last");
    } else {
      setDragOverPlaceholder(null);
    }
  }

  const updateDBOrder = (pages: Page[]) => {
    pages.map((newPage) => {
      const page = pagesMap.get(newPage.key);
      if (page && newPage.frontmatter.order !== page.frontmatter.order) {
        updateQuizPageFrontmatter(quizVersion, page.frontmatter.id, {
          order: newPage.frontmatter.order,
        });
      }
    });
  };
  // Drag end: reorder pages
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    console.log(active, over);
    if (!over || active.id === over.id) return;

    // Handle drop on placeholder
    if (over.id === "__first__" || dragOverPlaceholder === "first") {
      const activeIndex = pages.findIndex((p) => p.key === active.id);
      if (activeIndex === -1) return;
      const activePage = pages[activeIndex];
      // Move to first order and to the first position in the array
      const newPages = [...pages];
      newPages.splice(activeIndex, 1, {
        ...activePage,
        frontmatter: {
          ...activePage.frontmatter,
          order: firstOrder - 1,
        },
      }); // Remove dragged page
      setPages(newPages);
      updateQuizPageFrontmatter(quizVersion, activePage.frontmatter.id, {
        order: firstOrder,
      });
      updateXarrow();
      updateDBOrder(newPages);
      setDragOverPlaceholder(null);
      return;
    }
    if (over.id === "__last__" || dragOverPlaceholder === "last") {
      const activeIndex = pages.findIndex((p) => p.key === active.id);
      if (activeIndex === -1) return;
      const activePage = pages[activeIndex];
      // Move to first order and to the first position in the array
      const newPages = [...pages];
      newPages.splice(activeIndex, 1, {
        ...activePage,
        frontmatter: {
          ...activePage.frontmatter,
          order: lastOrder + 1,
        },
      }); // Remove dragged page
      setPages(newPages);
      updateQuizPageFrontmatter(quizVersion, activePage.frontmatter.id, {
        order: firstOrder,
      });
      updateXarrow();
      updateDBOrder(newPages);
      setDragOverPlaceholder(null);
      return;
    }

    // Normal move
    const activeIndex = pages.findIndex((p) => p.key === active.id);
    const overIndex = pages.findIndex((p) => p.key === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    // Move the page in the flat array
    const newPages = arrayMove(pages, activeIndex, overIndex);

    // Update order fields if moved across groups
    const overPage = pages[overIndex];
    const activePage = pages[activeIndex];
    if (activePage.frontmatter.order !== overPage.frontmatter.order) {
      // Assign the new order to the dragged page
      newPages[overIndex] = {
        ...activePage,
        frontmatter: {
          ...activePage.frontmatter,
          order: overPage.frontmatter.order,
        },
      };
    }
    updateXarrow();
    updateDBOrder(newPages);
    setPages(newPages);
    setDragOverPlaceholder(null);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <QuizPagesHeader quizVersion={quizVersion} />
      <div className="flex-1 px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="max-w-6xl mx-auto space-y-24">
            <Xwrapper>
              {/* First order placeholder */}
              <SortableContext
                items={["__first__"]}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex justify-center gap-6 mb-8">
                  <div
                    id="__first__"
                    key="__first__"
                    style={{ minWidth: "20rem" }}
                  >
                    <OrderPlaceholder
                      id="__first__"
                      position="first"
                      onDrop={() => {}}
                      isActive={dragOverPlaceholder === "first"}
                    />
                  </div>
                </div>
              </SortableContext>
              {[...groupedPages.entries()].map(([order, groupPages]) => (
                <SortableContext
                  key={order}
                  items={groupPages.map((p) => p.key)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex justify-center gap-6">
                    {groupPages.map((page) => {
                      // Extract <SingleDefaultQuiz options="..."/> from markdown content using html-react-parser only
                      let quizOptions: Array<{
                        label: string;
                        value: string;
                        next?: string;
                      }> = [];

                      parse(page.content, {
                        trim: true,
                        replace: (
                          domNode: import("html-react-parser").Element
                        ) => {
                          if (
                            domNode.type === "tag" &&
                            domNode.name ===
                              "SingleDefaultQuiz".toLowerCase() &&
                            domNode.attribs &&
                            domNode.attribs.options
                          ) {
                            try {
                              const decoded = he.decode(
                                domNode.attribs.options
                              );
                              quizOptions = JSON.parse(decoded);
                            } catch {
                              quizOptions = [];
                            }
                          }
                          return domNode;
                        },
                      });

                      return (
                        <div
                          id={page.frontmatter.id}
                          key={page.key}
                          className="relative flex flex-col items-center"
                        >
                          <SortablePageCard
                            onDelete={() =>
                              deleteQuizPage(quizVersion, page.frontmatter.id)
                            }
                            quizVersion={quizVersion}
                            id={page.key}
                            page={page}
                            onClick={() => setSelectedPage(page)}
                            selected={selectedPage?.key === page.key}
                          />
                          {quizOptions.map((option) => {
                            if (option.next)
                              return (
                                <Xarrow
                                  startAnchor={"bottom"}
                                  endAnchor={"top"}
                                  key={`${page.key}-${option.next}`}
                                  start={page.frontmatter.id.toString()}
                                  end={option.next}
                                  strokeWidth={1}
                                  labels={
                                    <div className="bg-background container p-1 shadow-sm rounded-sm">
                                      {option.label}
                                    </div>
                                  }
                                />
                              );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </SortableContext>
              ))}
              {/* Last order placeholder */}
              <SortableContext
                items={["__last__"]}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex justify-center gap-6 mt-8">
                  <div
                    id="__last__"
                    key="__last__"
                    style={{ minWidth: "20rem" }}
                  >
                    <OrderPlaceholder
                      id="__last__"
                      position="last"
                      onDrop={() => {}}
                      isActive={dragOverPlaceholder === "first"}
                    />
                  </div>
                </div>
              </SortableContext>
            </Xwrapper>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
