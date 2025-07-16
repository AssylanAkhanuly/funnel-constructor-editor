"use client";
import PageCard from "@/entities/page/ui/page-card";
import { useState } from "react";
import { Page } from "../types";
import QuizPagesHeader from "./quiz-pages-header";

// Page card component

export default function QuizPagesList({
  pages,
  quizVersion,
}: {
  pages: Page[];
  quizVersion: string;
}) {
  const [selectedPage, setSelectedPage] = useState<null | Page>(null);

  const groupedPages = (() => {
    const grouped = new Map<string, Page[]>();
    for (let index = 0; index < pages.length; index++) {
      const page = pages[index];
      const group = grouped.get(page.frontmatter.order);
      if (!group) {
        grouped.set(page.frontmatter.order, [page]);
      } else {
        group.push(page);
      }
    }
    return grouped;
  })();
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <QuizPagesHeader quizVersion={quizVersion} />
      {/* Flow Visualization */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {[...groupedPages.entries()].map(([order, pages], index) => {
            return (
              <div key={order}>
                {/* Pages at this position */}
                <div className={`flex justify-center gap-6 `}>
                  {pages.map((page) => (
                    <div key={page.key} className="w-80">
                      <PageCard
                        page={{
                          type: page.frontmatter.type,
                          id: page.frontmatter.id,
                          order: page.frontmatter.order,
                        }}
                        isSelected={
                          selectedPage?.frontmatter.id === page.frontmatter.id
                        }
                        onClick={() => setSelectedPage(page)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add Page Button */}
        </div>
      </div>
    </div>
  );
}
