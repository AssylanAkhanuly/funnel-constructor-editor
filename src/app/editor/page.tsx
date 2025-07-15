"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@/features/editor/ui";
import { Edit, Maximize2, Plus, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Mock S3 data - in real app, this would come from API calls
const mockMDXFiles = [
  {
    id: "welcome",
    type: "Teaser",
    order: 1,
    next: "q1",
    nextMap: {},
    content:
      "# Welcome to Our Funnel\n\nThis is the starting point of your journey.",
    title: "Welcome Page",
    position: { x: 100, y: 200 },
  },
  {
    id: "q1",
    type: "Question",
    order: 2,
    next: null,
    nextMap: {
      yes: "q2-yes",
      no: "q2-no",
    },
    content: "# Are you interested in our premium features?\n\n- Yes\n- No",
    title: "Premium Interest",
    position: { x: 400, y: 200 },
  },
  {
    id: "q2-yes",
    type: "Teaser",
    order: 3,
    next: "pricing",
    nextMap: {},
    content:
      "# Great! Let me show you our premium features\n\nYou'll love what we have to offer.",
    title: "Premium Features",
    position: { x: 700, y: 100 },
  },
  {
    id: "q2-no",
    type: "Teaser",
    order: 3,
    next: "free-trial",
    nextMap: {},
    content:
      "# No problem! Start with our free features\n\nYou can always upgrade later.",
    title: "Free Features",
    position: { x: 700, y: 300 },
  },
  {
    id: "pricing",
    type: "Teaser",
    order: 4,
    next: "checkout",
    nextMap: {},
    content: "# Pricing Plans\n\nChoose the plan that fits your needs.",
    title: "Pricing",
    position: { x: 1000, y: 100 },
  },
  {
    id: "free-trial",
    type: "Teaser",
    order: 4,
    next: "signup",
    nextMap: {},
    content:
      "# Start Your Free Trial\n\n30 days free, no credit card required.",
    title: "Free Trial",
    position: { x: 1000, y: 300 },
  },
  {
    id: "checkout",
    type: "Teaser",
    order: 5,
    next: null,
    nextMap: {},
    content: "# Complete Your Purchase\n\nSecure checkout process.",
    title: "Checkout",
    position: { x: 1300, y: 100 },
  },
  {
    id: "signup",
    type: "Teaser",
    order: 5,
    next: null,
    nextMap: {},
    content: "# Sign Up\n\nCreate your account to get started.",
    title: "Sign Up",
    position: { x: 1300, y: 300 },
  },
];

// Canvas Node Component
const CanvasNode = ({ node, isSelected, onSelect, onDrag, zoom }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    });
    onSelect(node);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = (e.clientX - dragStart.x) / zoom;
      const newY = (e.clientY - dragStart.y) / zoom;
      onDrag(node.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      ref={nodeRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 p-4 cursor-move transition-all ${
        isSelected
          ? "border-blue-500 shadow-xl z-10"
          : "border-gray-200 hover:border-gray-400"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={node.type === "Question" ? "default" : "secondary"}>
          {node.type}
        </Badge>
        <Badge variant="outline">#{node.order}</Badge>
      </div>
      <div className="font-medium text-sm">{node.title || node.id}</div>
      <div className="text-xs text-gray-500 mt-1">{node.id}</div>
    </div>
  );
};

// Connection Line Component
const ConnectionLine = ({ from, to, label, zoom }) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Calculate control points for curved line
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const ctrl1X = from.x + dx * 0.5;
  const ctrl1Y = from.y;
  const ctrl2X = to.x - dx * 0.5;
  const ctrl2Y = to.y;

  return (
    <g>
      <path
        d={`M ${from.x} ${from.y} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${to.x} ${to.y}`}
        stroke="#94a3b8"
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      {label && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x="-20"
            y="-10"
            width="40"
            height="20"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// Canvas Map View Component
const CanvasMapView = ({ files, selectedFile, onFileSelect, onNodeDrag }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.closest("svg")) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    if (isPanning) {
      window.addEventListener("mousemove", handleCanvasMouseMove);
      window.addEventListener("mouseup", handleCanvasMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleCanvasMouseMove);
        window.removeEventListener("mouseup", handleCanvasMouseUp);
      };
    }
  }, [isPanning, panStart]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Calculate connections
  const connections = [];
  files.forEach((file) => {
    const fromPos = {
      x: file.position.x + 120,
      y: file.position.y + 40,
    };

    if (file.next) {
      const targetFile = files.find((f) => f.id === file.next);
      if (targetFile) {
        connections.push({
          from: fromPos,
          to: {
            x: targetFile.position.x,
            y: targetFile.position.y + 40,
          },
          label: null,
        });
      }
    }

    Object.entries(file.nextMap || {}).forEach(([key, targetId]) => {
      const targetFile = files.find((f) => f.id === targetId);
      if (targetFile) {
        connections.push({
          from: fromPos,
          to: {
            x: targetFile.position.x,
            y: targetFile.position.y + 40,
          },
          label: key,
        });
      }
    });
  });

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleZoomReset}>
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-full cursor-move"
        style={{
          cursor: isPanning ? "grabbing" : "grab",
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* SVG for connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: "200%", height: "200%" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
            </marker>
          </defs>
          <g transform={`scale(${zoom})`}>
            {connections.map((conn, idx) => (
              <ConnectionLine
                key={idx}
                from={conn.from}
                to={conn.to}
                label={conn.label}
                zoom={zoom}
              />
            ))}
          </g>
        </svg>

        {/* Nodes */}
        {files.map((file) => (
          <CanvasNode
            key={file.id}
            node={file}
            isSelected={selectedFile?.id === file.id}
            onSelect={onFileSelect}
            onDrag={onNodeDrag}
            zoom={zoom}
          />
        ))}
      </div>
    </div>
  );
};

export default function FunnelConstructor() {
  const [activeTab, setActiveTab] = useState("editor");
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    // uploadMdxFile("test/1.mdx", markdown);
  }, [markdown]);
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Funnel Constructor Editor</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Page
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="editor">
            <Edit className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 p-4">
          <Editor markdown={markdown} onChange={setMarkdown} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
