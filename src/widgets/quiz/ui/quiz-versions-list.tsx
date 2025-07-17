"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Search,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import QuizVersionsHeader from "./quiz-version-header";

// Mock data for funnel versions

const getStatusIcon = (status) => {
  switch (status) {
    case "published":
      return <CheckCircle2 className="w-4 h-4" />;
    case "draft":
      return <AlertCircle className="w-4 h-4" />;
    case "error":
      return <XCircle className="w-4 h-4" />;
    case "archived":
      return <Archive className="w-4 h-4" />;
    default:
      return null;
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    case "error":
      return "destructive";
    case "archived":
      return "outline";
    default:
      return "default";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export default function QuizVersionsList({
  quizVersions,
}: {
  quizVersions: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersions, setSelectedVersions] = useState(new Set());

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <QuizVersionsHeader />
      {/* Filters and Search */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search funnels..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              All Status
            </Button>
            <Button variant="outline" size="sm">
              Last 30 days
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full bg-white">
        <thead className="bg-gray-50 border-b sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Funnel Name
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {quizVersions.map((version) => (
            <tr key={version} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <Link href={`/${version}`}>{version}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
    </div>
  );
}
