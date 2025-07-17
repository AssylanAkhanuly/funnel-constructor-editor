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
  // Flat list of pages, sorted by order and then by index within order
  const [pages, setPages] = useState<Page[]>([...initialPages]);
  const [selectedPage, setSelectedPage] = useState<null | Page>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  // Drag start: highlight
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  // Drag end: reorder pages
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Find the dragged page and the target page
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
    newPages.map((newPage) => {
      const page = pagesMap.get(newPage.key);
      if (page && newPage.frontmatter.order !== page.frontmatter.order) {
        console.log(newPage.frontmatter.order, page.frontmatter.order);
        // TODO: update frontmatter props in S3
        updateQuizPageFrontmatter(quizVersion, page.frontmatter.id, {
          order: newPage.frontmatter.order,
        });
      }
    });
    setPages(newPages);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <QuizPagesHeader quizVersion={quizVersion} />
      <div className="flex-1 px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="max-w-6xl mx-auto space-y-24">
            <Xwrapper>
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
                            console.log(page.frontmatter.id, option.next);
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
            </Xwrapper>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
