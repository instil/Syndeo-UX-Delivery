"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import {
  MessageSquare,
  HelpCircle,
  GitBranch,
  Code,
  Workflow,
  Globe,
  FileText,
  Variable,
  Bell,
  ArrowLeft,
  Save,
  Maximize2,
  X,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link,
  Smile,
  Settings,
  MoreVertical,
  Pencil,
  Trash2,
  AlignLeft,
  Target,
  Scale,
  Zap,
  Home,
  Undo,
  ZoomIn,
  Pen,
  Users,
  Send,
  Bot,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Box,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type NodeType =
  | "message"
  | "paragraph"
  | "question"
  | "intent"
  | "decision"
  | "script"
  | "variables"
  | "notify"
  | "flow"
  | "switch"
  | "route"
  | "web"
  | "catch"
  | "end"

interface Node {
  id: string
  type: NodeType
  label: string
  x: number
  y: number
  connections: string[]
}

const nodeTypes: Array<{ type: NodeType; label: string; icon: any; color: string }> = [
  { type: "message", label: "Message", icon: MessageSquare, color: "#3B4760" },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft, color: "#5A668E" },
  { type: "question", label: "Question", icon: HelpCircle, color: "#4ECDC4" },
  { type: "intent", label: "Intent", icon: Target, color: "#4ECDC4" },
  { type: "decision", label: "Decision", icon: Scale, color: "#E8A960" },
  { type: "script", label: "Script", icon: FileText, color: "#6A738A" },
  { type: "variables", label: "Variables", icon: Variable, color: "#6A738A" },
  { type: "notify", label: "Notify", icon: Bell, color: "#B8A5A5" },
  { type: "flow", label: "Flow", icon: Workflow, color: "#9B6B9E" },
  { type: "switch", label: "Switch", icon: GitBranch, color: "#9B6B9E" },
  { type: "route", label: "Route", icon: ArrowLeft, color: "#5A668E" },
  { type: "web", label: "Web", icon: Globe, color: "#6FA8C4" },
  { type: "catch", label: "Catch", icon: Zap, color: "#3B4760" },
  { type: "end", label: "End", icon: Maximize2, color: "#3B4760" },
]

const initialNodes: Node[] = [
  { id: "1", type: "message", label: "Welcome message", x: 600, y: 150, connections: ["2"] },
  { id: "2", type: "question", label: "Ask for email", x: 600, y: 350, connections: ["3"] },
  { id: "3", type: "decision", label: "If user says yes", x: 600, y: 550, connections: ["4", "5"] },
  { id: "4", type: "message", label: "Send confirmation", x: 450, y: 750, connections: [] },
  { id: "5", type: "web", label: "API call", x: 750, y: 750, connections: [] },
]

interface FlowCanvasProps {
  outcomeId: string
  outcomeName: string
  onBack: () => void
  onOutcomeChange: (outcomeId: string, outcomeName: string) => void
}

type TabType = "flow" | "statements" | "details"

export function FlowCanvas({ outcomeId, outcomeName, onBack, onOutcomeChange }: FlowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<TabType>("flow")
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const minimapRef = useRef<HTMLDivElement>(null)
  const [statements, setStatements] = useState<{ text: string; createdAt: string }[]>([
    { text: "test", createdAt: "Jun 10, 2025" },
  ])
  const [newStatement, setNewStatement] = useState("")
  const [showStatementsInfo, setShowStatementsInfo] = useState(false)
  const [showDetailsInfo, setShowDetailsInfo] = useState(false)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [nodeEditTab, setNodeEditTab] = useState<"skip" | "message" | "llm" | "exception">("message")
  const [nodeEditContent, setNodeEditContent] = useState<string[]>([""])
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null)
  const [simulatorInput, setSimulatorInput] = useState("")
  const [simulatorMessages, setSimulatorMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi! I'm ready to simulate this outcome. Press ▶ to start." },
  ])
  const [simulatorCollapsed, setSimulatorCollapsed] = useState(false)
  const [blocksCollapsed, setBlocksCollapsed] = useState(false)
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false)
  const dragBlockType = useRef<NodeType | null>(null)
  const [dragGhost, setDragGhost] = useState<{ x: number; y: number; type: NodeType } | null>(null)
  const [snapTarget, setSnapTarget] = useState<string | null>(null)
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null)
  const isMinimapDragging = useRef(false)

  const WORLD = 2000
  const SNAP_THRESHOLD = 160 // canvas px
  const NODE_W = 200
  const NODE_H = 80

  const getNodeAtPoint = (canvasX: number, canvasY: number): string | null => {
    for (const node of nodes) {
      if (canvasX >= node.x && canvasX <= node.x + NODE_W &&
          canvasY >= node.y && canvasY <= node.y + NODE_H) {
        return node.id
      }
    }
    return null
  }

  const panToWorldPoint = useCallback((worldX: number, worldY: number) => {
    const canvasW = canvasRef.current?.clientWidth ?? 800
    const canvasH = canvasRef.current?.clientHeight ?? 600
    const scale = zoom / 100
    setPanOffset({
      x: -(worldX * scale - canvasW / 2),
      y: -(worldY * scale - canvasH / 2),
    })
  }, [zoom])

  const minimapEventToWorld = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = minimapRef.current?.getBoundingClientRect()
    if (!rect) return null
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    return { x: px * WORLD, y: py * WORLD }
  }

  const handleMinimapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    isMinimapDragging.current = true
    const pt = minimapEventToWorld(e)
    if (pt) panToWorldPoint(pt.x, pt.y)
  }

  const handleMinimapMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMinimapDragging.current) return
    const pt = minimapEventToWorld(e)
    if (pt) panToWorldPoint(pt.x, pt.y)
  }, [panToWorldPoint])

  const handleMinimapMouseUp = () => {
    isMinimapDragging.current = false
  }


  const getNearestNode = (canvasX: number, canvasY: number): { id: string; dist: number } | null => {
    let nearest: { id: string; dist: number } | null = null
    for (const node of nodes) {
      const cx = node.x + 100 // centre of 200px-wide card
      const cy = node.y + 40
      const dist = Math.hypot(canvasX - cx, canvasY - cy)
      if (!nearest || dist < nearest.dist) nearest = { id: node.id, dist }
    }
    return nearest
  }

  const screenToCanvas = (screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (screenX - rect.left - panOffset.x) / (zoom / 100),
      y: (screenY - rect.top - panOffset.y) / (zoom / 100),
    }
  }
  const getNodeColor = (type: NodeType) => {
    return nodeTypes.find((nt) => nt.type === type)?.color || "#6A738A"
  }

  const pendingNodeDrag = useRef<{ nodeId: string; offsetX: number; offsetY: number } | null>(null)

  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return
    mouseDownPos.current = { x: e.clientX, y: e.clientY }
    // Store drag info but don't activate drag yet — wait for movement threshold
    pendingNodeDrag.current = {
      nodeId,
      offsetX: (e.clientX - (canvasRef.current?.getBoundingClientRect().left ?? 0) - panOffset.x) / (zoom / 100) - node.x,
      offsetY: (e.clientY - (canvasRef.current?.getBoundingClientRect().top ?? 0) - panOffset.y) / (zoom / 100) - node.y,
    }
  }

  const handleNodeMouseUp = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!mouseDownPos.current) return
    const dist = Math.hypot(e.clientX - mouseDownPos.current.x, e.clientY - mouseDownPos.current.y)
    mouseDownPos.current = null
    pendingNodeDrag.current = null
    setDraggedNode(null)
    if (dist < 5) {
      // It's a click, not a drag — select the node
      setSelectedNodeId((prev) => prev === nodeId ? null : nodeId)
      setNodeEditContent([nodes.find((n) => n.id === nodeId)?.label ?? ""])
      setNodeEditTab("message")
    }
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStart.x
        const dy = e.clientY - panStart.y
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
        setPanStart({ x: e.clientX, y: e.clientY })
        return
      }

      // Activate node drag only after moving 5px threshold
      let activeDraggedNode = draggedNode
      if (!activeDraggedNode && pendingNodeDrag.current && mouseDownPos.current) {
        const dist = Math.hypot(e.clientX - mouseDownPos.current.x, e.clientY - mouseDownPos.current.y)
        if (dist >= 5) {
          activeDraggedNode = pendingNodeDrag.current.nodeId
          setDraggedNode(activeDraggedNode)
          setDragOffset({ x: pendingNodeDrag.current.offsetX, y: pendingNodeDrag.current.offsetY })
        }
      }

      if (!activeDraggedNode) return

      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      const x = Math.round(((e.clientX - canvasRect.left - panOffset.x) / (zoom / 100) - dragOffset.x) / 20) * 20
      const y = Math.round(((e.clientY - canvasRect.top - panOffset.y) / (zoom / 100) - dragOffset.y) / 20) * 20

      setNodes((prevNodes) => prevNodes.map((node) => (node.id === activeDraggedNode ? { ...node, x, y } : node)))
    },
    [draggedNode, dragOffset, isPanning, panStart, panOffset, zoom],
  )

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom or ctrl+scroll = zoom
      const delta = e.deltaY > 0 ? -10 : 10
      setZoom((prev) => Math.min(200, Math.max(50, prev + delta)))
    } else {
      // Regular scroll = pan
      setPanOffset((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }))
    }
  }, [])

  const handleMouseUp = () => {
    setDraggedNode(null)
    pendingNodeDrag.current = null
    setIsPanning(false)
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setIsDragOverCanvas(true)
    const { x, y } = screenToCanvas(e.clientX, e.clientY)
    const replace = getNodeAtPoint(x, y)
    if (replace) {
      setReplaceTarget(replace)
      setSnapTarget(null)
    } else {
      setReplaceTarget(null)
      const nearest = getNearestNode(x, y)
      setSnapTarget(nearest && nearest.dist < SNAP_THRESHOLD ? nearest.id : null)
    }
  }

  const handleCanvasDragLeave = () => {
    setIsDragOverCanvas(false)
    setSnapTarget(null)
    setReplaceTarget(null)
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverCanvas(false)
    const type = dragBlockType.current
    if (!type) return

    const label = nodeTypes.find((nt) => nt.type === type)?.label ?? type

    if (replaceTarget) {
      // Replace existing node — keep position, id and connections; swap type/label
      setNodes((prev) => prev.map((n) =>
        n.id === replaceTarget ? { ...n, type, label } : n
      ))
    } else {
      const { x, y } = screenToCanvas(e.clientX, e.clientY)
      const snappedX = Math.round(x / 20) * 20
      const snappedY = Math.round(y / 20) * 20
      const newId = `node-${Date.now()}`
      const newNode: Node = { id: newId, type, label, x: snappedX, y: snappedY, connections: [] }

      setNodes((prev) => {
        const updated = [...prev, newNode]
        if (snapTarget) {
          return updated.map((n) =>
            n.id === snapTarget && !n.connections.includes(newId)
              ? { ...n, connections: [...n.connections, newId] }
              : n
          )
        }
        return updated
      })
    }

    dragBlockType.current = null
    setDragGhost(null)
    setSnapTarget(null)
    setReplaceTarget(null)
  }

  const handleBlockDragStart = (e: React.DragEvent, type: NodeType) => {
    dragBlockType.current = type
    e.dataTransfer.effectAllowed = "copy"
    // Suppress default browser ghost
    const ghost = document.createElement("div")
    ghost.style.cssText = "position:fixed;top:-100px;left:-100px;width:1px;height:1px;"
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)

    setDragGhost({ x: e.clientX, y: e.clientY, type })

    const onMove = (ev: DragEvent) => {
      if (ev.clientX === 0 && ev.clientY === 0) return // ignore end-of-drag ghost flicker
      setDragGhost({ x: ev.clientX, y: ev.clientY, type })
    }
    const onEnd = () => {
      setDragGhost(null)
      document.removeEventListener("dragover", onMove)
      document.removeEventListener("dragend", onEnd)
    }
    document.addEventListener("dragover", onMove)
    document.addEventListener("dragend", onEnd)
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-node]') && !target.closest('button') && !target.closest('[role="menuitem"]')) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      setSelectedNodeId(null)
    }
  }

  const getConnectionPath = (fromNode: Node, toNode: Node, label?: string) => {
    const startX = fromNode.x + 100
    const startY = fromNode.y + 60
    const endX = toNode.x + 100
    const endY = toNode.y

    const midY = (startY + endY) / 2

    return {
      path: `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`,
      labelX: (startX + endX) / 2,
      labelY: midY,
    }
  }

  const handleEditNode = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    setNodeEditContent([node?.label || ""])
    setNodeEditTab("message")
    setEditingNodeId(nodeId)
  }

  const handleCloseEdit = () => setEditingNodeId(null)

  const handleSimulatorSend = () => {
    if (!simulatorInput.trim()) return
    const userMsg = simulatorInput.trim()
    setSimulatorMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "bot", text: "Got it! Processing your request..." },
    ])
    setSimulatorInput("")
  }

  const handleDeleteNode = (nodeId: string) => {
    console.log("[v0] Delete node:", nodeId)
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId))
  }

  return (
    <div className="h-full flex flex-col bg-[#F6F8FA]">
      {/* Header with Breadcrumb/Tabs */}
      <div className="bg-[#F6F8FA] px-6 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#E2E8F0] text-[#1E2535] hover:text-[#1E2535]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 group hover:bg-[#EAECF0] rounded-lg px-2 py-1 transition-colors">
                  <h1 className="text-xl font-light tracking-tight text-[#1E2535]">{outcomeName}</h1>
                  <ChevronDown className="w-4 h-4 text-[#6A738A] group-hover:text-[#1E2535] transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {[
                  "Account Setup",
                  "Support Ticket",
                  "FS_BranchLocator_V1",
                  "Re-Mortgage",
                  "Product Information",
                  "Booking Appointment",
                ].map((name) => (
                  <DropdownMenuItem
                    key={name}
                    onClick={() => onOutcomeChange(name, name)}
                    className={`gap-2 cursor-pointer ${name === outcomeName ? "font-semibold text-[#2F8FFF]" : ""}`}
                  >
                    <Workflow className="w-4 h-4 text-[#6A738A] flex-shrink-0" />
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Tabs — Figma-style bordered pill for active */}
        <div className="flex items-center gap-1">
          {(["flow", "statements", "details"] as const).map((tab) => {
            const labels = { flow: "Outcome Flow", statements: "Customer Statements", details: "Outcome Details" }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-[#E2E8F0] text-[#1E2535] font-semibold"
                    : "border border-transparent text-[#6A738A] hover:text-[#1E2535] hover:bg-[#EAECF0]"
                }`}
              >
                {labels[tab]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-row-reverse overflow-hidden">
        <div className={`${activeTab !== "flow" ? "w-1/2" : "flex-1"} flex overflow-hidden relative`}>

          {/* CENTRE: Canvas (full remaining width) */}
          <div className="flex-1 relative overflow-hidden">
            <div
              ref={canvasRef}
              className={`h-full overflow-hidden bg-[#F6F8FA] select-none ${isPanning ? "cursor-grabbing" : "cursor-grab"} ${isDragOverCanvas ? "ring-2 ring-inset ring-[#2F8FFF]/40" : ""}`}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseDown={handleCanvasMouseDown}
              onWheel={handleWheel}
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
              onDrop={handleCanvasDrop}
              style={{
                backgroundImage: `
                  linear-gradient(to right, #EBF0F7 1px, transparent 1px),
                  linear-gradient(to bottom, #EBF0F7 1px, transparent 1px)
                `,
                backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
                backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
              }}
            >
              <div
                className={activeTab !== "flow" ? "hidden" : ""}
                style={{
                  transform: `scale(${zoom / 100}) translate(${panOffset.x / (zoom / 100)}px, ${panOffset.y / (zoom / 100)}px)`,
                  transformOrigin: "top left",
                  width: "2000px",
                  height: "2000px",
                  position: "relative",
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="8"
                      markerHeight="8"
                      refX="7"
                      refY="4"
                      orient="auto"
                      fill="#A0AEC0"
                    >
                      <path d="M 0 0 L 8 4 L 0 8 Z" />
                    </marker>
                  </defs>
                  {nodes.map((node) =>
                    node.connections.map((targetId, idx) => {
                      const targetNode = nodes.find((n) => n.id === targetId)
                      if (!targetNode) return null

                      const connection = getConnectionPath(node, targetNode)
                      const label = node.connections.length > 1 ? (idx === 0 ? "success" : "failure") : undefined

                      return (
                        <g key={`${node.id}-${targetId}`}>
                          <path
                            d={connection.path}
                            stroke="#A0AEC0"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                            className="transition-all duration-200"
                          />
                          <circle
                            cx={connection.path.split(" ")[1]}
                            cy={connection.path.split(" ")[2]}
                            r="4"
                            fill={getNodeColor(node.type)}
                          />
                          <circle
                            cx={targetNode.x + 100}
                            cy={targetNode.y}
                            r="4"
                            fill={getNodeColor(targetNode.type)}
                          />
                          {label && (
                            <text
                              x={connection.labelX}
                              y={connection.labelY - 5}
                              textAnchor="middle"
                              className="text-xs fill-[#6A738A] font-medium"
                            >
                              {label}
                            </text>
                          )}
                        </g>
                      )
                    }),
                  )}
                </svg>

                {nodes.map((node) => {
                  const Icon = nodeTypes.find((nt) => nt.type === node.type)?.icon || MessageSquare
                  const nodeColor = getNodeColor(node.type)
                  const isEditing = editingNodeId === node.id
                  const isSelected = selectedNodeId === node.id
                  const isSnapping = snapTarget === node.id
                  const isReplacing = replaceTarget === node.id
                  const dragGhostNode = dragGhost ? nodeTypes.find((nt) => nt.type === dragGhost.type) : null
                  return (
                    <Card
                      key={node.id}
                      data-node="true"
                      className={`absolute cursor-move transition-all duration-150 hover:shadow-xl border-none shadow-lg
                        ${isEditing ? "ring-2 ring-white ring-offset-2" : ""}
                        ${isSelected ? "ring-2 ring-[#2F8FFF] ring-offset-2" : ""}
                        ${isSnapping ? "ring-2 ring-white ring-offset-2 scale-105" : ""}
                        ${isReplacing ? "ring-4 ring-orange-400 ring-offset-2 scale-105 brightness-75" : ""}
                      `}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: 200,
                        backgroundColor: isReplacing && dragGhostNode ? dragGhostNode.color : nodeColor,
                        zIndex: draggedNode === node.id ? 10 : isSelected ? 8 : isReplacing || isSnapping ? 5 : 2,
                        transition: "background-color 0.15s, box-shadow 0.15s, transform 0.15s, filter 0.15s",
                      }}
                      onMouseDown={(e) => {
                        handleNodeMouseDown(node.id, e)
                      }}
                      onMouseUp={(e) => {
                        handleNodeMouseUp(node.id, e)
                      }}
                    >
                      {isReplacing && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                          <span className="bg-orange-400 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                            Replace
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-white" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{node.type}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="ml-auto w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-3.5 h-3.5 text-white" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditNode(node.id)
                                }}
                                className="gap-2 cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteNode(node.id)
                                }}
                                className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm font-medium text-white">{node.label}</p>
                      </div>
                      {/* Connection points */}
                      <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2"
                        style={{ borderColor: nodeColor }}
                      />
                      <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2"
                        style={{ borderColor: nodeColor }}
                      />
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Node edit popover */}
            {activeTab === "flow" && selectedNodeId && (() => {
              const node = nodes.find((n) => n.id === selectedNodeId)
              if (!node) return null
              const NodeIcon = nodeTypes.find((nt) => nt.type === node.type)?.icon || MessageSquare
              const nodeColor = getNodeColor(node.type)
              const scale = zoom / 100
              const popX = node.x * scale + panOffset.x + 210
              const popY = node.y * scale + panOffset.y
              return (
                <div
                  className="absolute z-30 w-[480px] bg-white rounded-xl shadow-2xl border border-[#DDE5EF] flex flex-col overflow-hidden"
                  style={{ left: popX, top: popY, maxHeight: "80vh" }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDE5EF]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: nodeColor }}>
                        <NodeIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1E2535] leading-tight capitalize">{node.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNodeId(null)}
                      className="w-7 h-7 rounded-lg hover:bg-[#F0F6FF] flex items-center justify-center text-[#6A738A] hover:text-[#1E2535] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#DDE5EF]">
                    {(["skip", "message", "llm", "exception"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setNodeEditTab(tab)}
                        className={`flex-1 py-2 text-xs font-medium transition-colors border-b-2 ${
                          nodeEditTab === tab
                            ? "border-[#2F8FFF] text-[#2F8FFF]"
                            : "border-transparent text-[#6A738A] hover:text-[#1E2535]"
                        }`}
                      >
                        {tab === "llm" ? "LLM" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {nodeEditTab === "message" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-1.5">Task Name</label>
                          <input
                            className="w-full px-3 py-2 rounded-lg border border-[#DDE5EF] bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30 focus:border-[#2F8FFF]"
                            defaultValue={node.label}
                            onChange={(e) => setNodes((prev) => prev.map((n) => n.id === node.id ? { ...n, label: e.target.value } : n))}
                          />
                        </div>
                        <div className="rounded-xl border border-[#DDE5EF] bg-white p-4 space-y-3">
                          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block">Message</label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#DDE5EF] accent-[#2F8FFF]" />
                              <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wider">Out of Bubble</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#DDE5EF] accent-[#2F8FFF]" />
                              <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wider">Allow Reactions</span>
                            </label>
                            <button className="w-4 h-4 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs flex-shrink-0">i</button>
                          </div>
                          {nodeEditContent.map((msg, msgIdx) => (
                            <div key={msgIdx} className="border border-[#DDE5EF] rounded-xl overflow-hidden">
                              <div className="flex items-center p-2 border-b border-[#DDE5EF] bg-[#F6F8FA]">
                                <div className="flex gap-1">
                                  {[Bold, Italic, Underline, Strikethrough, List, Code, Link, Smile].map((Icon, i) => (
                                    <Button key={i} variant="ghost" size="icon" className="h-7 w-7 hover:bg-white text-[#6A738A]">
                                      <Icon className="w-3.5 h-3.5" />
                                    </Button>
                                  ))}
                                </div>
                                {nodeEditContent.length > 1 && (
                                  <button
                                    onClick={() => setNodeEditContent(nodeEditContent.filter((_, i) => i !== msgIdx))}
                                    className="ml-auto w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#9AA3B0] hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <Textarea
                                rows={4}
                                value={msg}
                                onChange={(e) => setNodeEditContent(nodeEditContent.map((m, i) => i === msgIdx ? e.target.value : m))}
                                className="border-none bg-[#F6F8FA] focus:ring-0 resize-none text-sm rounded-none"
                                placeholder="Enter message..."
                              />
                              <div className="px-3 py-1.5 text-xs text-[#9AA3B0] text-right border-t border-[#DDE5EF] bg-[#F6F8FA]">
                                {msg.length} of 2000 characters
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider whitespace-nowrap">Media Type</label>
                            <select className="px-3 py-2 rounded-lg border border-[#DDE5EF] bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30">
                              <option>No</option>
                              <option>Image</option>
                              <option>Video</option>
                              <option>File</option>
                            </select>
                          </div>
                          <Button variant="ghost" className="w-full border border-[#DDE5EF] text-[#6A738A] hover:text-[#1E2535] hover:bg-[#F6F8FA] text-sm h-9" onClick={() => setNodeEditContent([...nodeEditContent, ""])}>+ Add Alternative Message</Button>
                        </div>
                        <div className="rounded-xl border border-[#DDE5EF] bg-white p-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#DDE5EF] accent-[#2F8FFF]" />
                            <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wider">Send Immediately</span>
                            <button className="w-4 h-4 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs flex-shrink-0">i</button>
                          </label>
                        </div>
                      </div>
                    )}
                    {nodeEditTab === "skip" && (
                      <p className="text-sm text-[#6A738A]">Configure skip conditions for this node.</p>
                    )}
                    {nodeEditTab === "llm" && (
                      <div>
                        <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-1.5">LLM Instructions</label>
                        <Textarea rows={5} className="border border-[#DDE5EF] rounded-lg text-sm resize-none" placeholder="Add instructions for the LLM..." />
                      </div>
                    )}
                    {nodeEditTab === "exception" && (
                      <p className="text-sm text-[#6A738A]">Configure exception handling for this node.</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-[#DDE5EF] flex items-center justify-between">
                    <button
                      onClick={() => { setNodes((prev) => prev.filter((n) => n.id !== node.id)); setSelectedNodeId(null) }}
                      className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                    <Button
                      className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white px-5 h-8 text-sm rounded-lg"
                      onClick={() => setSelectedNodeId(null)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )
            })()}

            {/* Left floating panels — Wayfinder + Blocks + Controls */}
            <div className={`absolute top-4 left-4 z-20 w-40 flex flex-col gap-2 ${activeTab !== "flow" ? "hidden" : ""}`}>
              {/* Wayfinder */}
              <div className="bg-[#272C41] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2">
                  <div
                    ref={minimapRef}
                    className="w-full h-20 bg-white/5 rounded relative overflow-hidden mb-2 border border-white/10 cursor-crosshair select-none"
                    onMouseDown={handleMinimapMouseDown}
                    onMouseMove={handleMinimapMouseMove}
                    onMouseUp={handleMinimapMouseUp}
                    onMouseLeave={handleMinimapMouseUp}
                  >
                    {nodes.map((node) => (
                      <div
                        key={`mini-${node.id}`}
                        className="absolute rounded-sm transition-all duration-100"
                        style={{
                          left: `${(node.x / 2000) * 100}%`,
                          top: `${(node.y / 2000) * 100}%`,
                          width: `${(200 / 2000) * 100}%`,
                          height: `${(60 / 2000) * 100}%`,
                          backgroundColor: getNodeColor(node.type),
                          opacity: 0.8,
                          borderRadius: "2px",
                        }}
                      />
                    ))}
                    {/* Viewport indicator — live */}
                    {(() => {
                      const canvasW = canvasRef.current?.clientWidth ?? 800
                      const canvasH = canvasRef.current?.clientHeight ?? 600
                      const scale = zoom / 100
                      const vpW = (canvasW / scale / WORLD) * 100
                      const vpH = (canvasH / scale / WORLD) * 100
                      const vpL = (-panOffset.x / scale / WORLD) * 100
                      const vpT = (-panOffset.y / scale / WORLD) * 100
                      return (
                        <div
                          className="absolute border-2 border-[#2F8FFF] bg-[#2F8FFF]/10 rounded transition-all duration-75"
                          style={{
                            left: `${Math.max(0, vpL)}%`,
                            top: `${Math.max(0, vpT)}%`,
                            width: `${Math.min(100, vpW)}%`,
                            height: `${Math.min(100, vpH)}%`,
                          }}
                        />
                      )
                    })()}
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1">
                    <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))} className="h-6 w-6 text-[#2F8FFF] hover:bg-white/10 font-bold text-base">−</Button>
                    <span className="font-semibold text-sm text-white/70">{zoom}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))} className="h-6 w-6 text-[#2F8FFF] hover:bg-white/10 font-bold text-base">+</Button>
                  </div>
                </div>
              </div>

              {/* Blocks panel */}
              <div className="bg-[#272C41] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <button
                  onClick={() => setBlocksCollapsed(!blocksCollapsed)}
                  className="w-full flex items-center justify-between px-3 py-2 border-b border-white/10 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Box className="w-3 h-3 text-white/40" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Blocks</span>
                  </div>
                  {blocksCollapsed
                    ? <ChevronRight className="w-3 h-3 text-white/40" />
                    : <ChevronDown className="w-3 h-3 text-white/40" />
                  }
                </button>
                {!blocksCollapsed && (
                  <div className="p-2 grid grid-cols-2 gap-1.5 max-h-[calc(100vh-480px)] overflow-y-auto">
                    {nodeTypes.map(({ type, label, icon: Icon, color }) => (
                      <button
                        key={type}
                        draggable
                        onDragStart={(e) => handleBlockDragStart(e, type)}
                        className="flex flex-col items-center gap-1.5 px-1 py-2.5 rounded-lg text-white/70 hover:bg-white/[0.07] hover:text-white transition-colors border border-white/[0.07] cursor-grab active:cursor-grabbing"
                        title={label}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Controls panel */}
              <div className="bg-[#272C41] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <button className="flex items-center gap-2.5 px-3 py-2.5 text-white/60 hover:bg-white/[0.06] hover:text-white/90 w-full border-b border-white/10 transition-colors">
                 <Maximize2 className="w-3.5 h-3.5 flex-shrink-0" />
                 <span className="text-xs font-medium">Edit Return Types</span>
                </button>
                <button className="flex items-center gap-2.5 px-3 py-2.5 text-white/60 hover:bg-white/[0.06] hover:text-white/90 w-full transition-colors">
                 <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                 <span className="text-xs font-medium">Edit Parameters</span>
                </button>
              </div>
            </div>

          </div>
            {selectedNodeId && (() => {
              const node = nodes.find((n) => n.id === selectedNodeId)
              if (!node) return null
              const NodeIcon = nodeTypes.find((nt) => nt.type === node.type)?.icon || MessageSquare
              const nodeColor = getNodeColor(node.type)
              const scale = zoom / 100
              const popX = node.x * scale + panOffset.x + 210
              const popY = node.y * scale + panOffset.y
              return (
                <div
                  className="absolute z-30 w-[480px] bg-white rounded-xl shadow-2xl border border-[#DDE5EF] flex flex-col overflow-hidden"
                  style={{ left: popX, top: popY, maxHeight: "80vh" }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDE5EF]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: nodeColor }}>
                        <NodeIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1E2535] leading-tight capitalize">{node.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNodeId(null)}
                      className="w-7 h-7 rounded-lg hover:bg-[#F0F6FF] flex items-center justify-center text-[#6A738A] hover:text-[#1E2535] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#DDE5EF]">
                    {(["skip", "message", "llm", "exception"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setNodeEditTab(tab)}
                        className={`flex-1 py-2 text-xs font-medium transition-colors border-b-2 ${
                          nodeEditTab === tab
                            ? "border-[#2F8FFF] text-[#2F8FFF]"
                            : "border-transparent text-[#6A738A] hover:text-[#1E2535]"
                        }`}
                      >
                        {tab === "llm" ? "LLM" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {nodeEditTab === "message" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-1.5">Task Name</label>
                          <input
                            className="w-full px-3 py-2 rounded-lg border border-[#DDE5EF] bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30 focus:border-[#2F8FFF]"
                            defaultValue={node.label}
                            onChange={(e) => setNodes((prev) => prev.map((n) => n.id === node.id ? { ...n, label: e.target.value } : n))}
                          />
                        </div>
                        <div className="rounded-xl border border-[#DDE5EF] bg-white p-4 space-y-3">
                          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block">Message</label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#DDE5EF] accent-[#2F8FFF]" />
                              <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wider">Out of Bubble</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#DDE5EF] accent-[#2F8FFF]" />
                              <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wider">Allow Reactions</span>
                            </label>
                            <button className="w-4 h-4 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs flex-shrink-0">i</button>
                          </div>
                          {nodeEditContent.map((msg, msgIdx) => (
                            <div key={msgIdx} className="border border-[#DDE5EF] rounded-xl overflow-hidden">
                              <div className="flex items-center p-2 border-b border-[#DDE5EF] bg-[#F6F8FA]">
                                <div className="flex gap-1">
                                  {[Bold, Italic, Underline, Strikethrough, List, Code, Link, Smile].map((Icon, i) => (
                                    <Button key={i} variant="ghost" size="icon" className="h-7 w-7 hover:bg-white text-[#6A738A]">
                                      <Icon className="w-3.5 h-3.5" />
                                    </Button>
                                  ))}
                                </div>
                                {nodeEditContent.length > 1 && (
                                  <button
                                    onClick={() => setNodeEditContent(nodeEditContent.filter((_, i) => i !== msgIdx))}
                                    className="ml-auto w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#9AA3B0] hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <Textarea
                                rows={4}
                                value={msg}
                                onChange={(e) => setNodeEditContent(nodeEditContent.map((m, i) => i === msgIdx ? e.target.value : m))}
                                className="border-none bg-[#F6F8FA] focus:ring-0 resize-none text-sm rounded-none"
                                placeholder="Enter message..."
                              />
                              <div className="px-3 py-1.5 text-xs text-[#9AA3B0] text-right border-t border-[#DDE5EF] bg-[#F6F8FA]">
                                {msg.length} of 2000 characters
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider whitespace-nowrap">Media Type</label>
                            <select className="px-3 py-2 rounded-lg border border-[#DDE5EF] bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30">
                              <option>No</option>
                              <option>Image</option>
                              <option>Video</option>
                              <option>File</option>
                            </select>
                          </div>
                          <Button variant="ghost" className="w-full border border-[#DDE5EF] text-[#6A738A] hover:text-[#1E2535] hover:bg-[#F6F8FA] text-sm h-9" onClick={() => setNodeEditContent([...nodeEditContent, ""])}>+ Add Alternative Message</Button>
                        </div>
                        <div className="rounded-xl border border-[#DDE5EF] bg-white p-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#DDE5EF] accent-[#2F8FFF]" />
                            <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wider">Send Immediately</span>
                            <button className="w-4 h-4 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs flex-shrink-0">i</button>
                          </label>
                        </div>
                      </div>
                    )}
                    {nodeEditTab === "skip" && (
                      <p className="text-sm text-[#6A738A]">Configure skip conditions for this node.</p>
                    )}
                    {nodeEditTab === "llm" && (
                      <div>
                        <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-1.5">LLM Instructions</label>
                        <Textarea rows={5} className="border border-[#DDE5EF] rounded-lg text-sm resize-none" placeholder="Add instructions for the LLM..." />
                      </div>
                    )}
                    {nodeEditTab === "exception" && (
                      <p className="text-sm text-[#6A738A]">Configure exception handling for this node.</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-[#DDE5EF] flex items-center justify-between">
                    <button
                      onClick={() => { setNodes((prev) => prev.filter((n) => n.id !== node.id)); setSelectedNodeId(null) }}
                      className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                    <Button
                      className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white px-5 h-8 text-sm rounded-lg"
                      onClick={() => setSelectedNodeId(null)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )
            })()}
          {/* RIGHT: Simulator panel OR Node Edit panel */}
          {/* Collapsed simulator FAB — square */}
          {!editingNodeId && simulatorCollapsed && (
            <button
              onClick={() => setSimulatorCollapsed(false)}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-[#2F8FFF] shadow-lg flex items-center justify-center hover:bg-[#1a7ae8] transition-all"
              title="Open Simulator"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
          )}

          {editingNodeId ? (() => {
            const node = nodes.find((n) => n.id === editingNodeId)
            const Icon = nodeTypes.find((nt) => nt.type === node?.type)?.icon || MessageSquare
            const nodeColor = getNodeColor(node?.type || "message")
            return (
              <div className="w-80 bg-white border-l border-[#DDE5EF] flex flex-col flex-shrink-0">
                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDE5EF]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: nodeColor }}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6A738A] uppercase tracking-wider font-medium">{node?.type}</p>
                      <p className="text-sm font-semibold text-[#1E2535] leading-tight">{node?.label}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseEdit} className="w-7 h-7 rounded-lg hover:bg-[#F0F6FF] flex items-center justify-center text-[#6A738A] hover:text-[#1E2535] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#DDE5EF]">
                  {(["skip", "message", "llm", "exception"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setNodeEditTab(tab)}
                      className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                        nodeEditTab === tab
                          ? "border-[#2F8FFF] text-[#2F8FFF]"
                          : "border-transparent text-[#6A738A] hover:text-[#1E2535]"
                      }`}
                    >
                      {tab === "llm" ? "LLM" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {nodeEditTab === "message" && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-2">Task Name</label>
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-[#DDE5EF] bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30 focus:border-[#2F8FFF]"
                          defaultValue={node?.label}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-2">Message</label>
                        <div className="border border-[#DDE5EF] rounded-xl overflow-hidden">
                          <div className="flex gap-1 p-2 border-b border-[#DDE5EF] bg-[#F6F8FA]">
                            {[Bold, Italic, Underline, Strikethrough, List, Code, Link, Smile].map((Icon, i) => (
                              <Button key={i} variant="ghost" size="icon" className="h-7 w-7 hover:bg-white text-[#6A738A]">
                                <Icon className="w-3.5 h-3.5" />
                              </Button>
                            ))}
                          </div>
                          <Textarea
                            rows={5}
                            value={nodeEditContent[0] ?? ""}
                            onChange={(e) => setNodeEditContent([e.target.value, ...nodeEditContent.slice(1)])}
                            className="border-none bg-white focus:ring-0 resize-none text-sm rounded-none"
                            placeholder="Enter message..."
                          />
                          <div className="px-3 py-1.5 text-xs text-[#9AA3B0] text-right border-t border-[#DDE5EF] bg-[#F6F8FA]">
                            {(nodeEditContent[0] ?? "").length} of 2000 characters
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {nodeEditTab === "skip" && (
                    <p className="text-sm text-[#6A738A]">Configure skip conditions for this node.</p>
                  )}
                  {nodeEditTab === "llm" && (
                    <div>
                      <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wider block mb-2">LLM Instructions</label>
                      <Textarea rows={6} className="border border-[#DDE5EF] rounded-xl text-sm resize-none" placeholder="Add instructions for the LLM..." />
                    </div>
                  )}
                  {nodeEditTab === "exception" && (
                    <p className="text-sm text-[#6A738A]">Configure exception handling for this node.</p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-[#DDE5EF] flex items-center justify-between">
                  <button className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                  <Button
                    className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white px-5 h-8 text-sm rounded-lg"
                    onClick={handleCloseEdit}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )
          })() : (
            /* Simulator floating panel */
            <div className={`${simulatorCollapsed ? "hidden" : "flex"} absolute top-3 right-3 z-10 w-80 flex-col bg-white rounded-xl shadow-2xl border border-[#DDE5EF] overflow-hidden`} style={{maxHeight: "calc(100% - 24px)"}}>
              {/* Blue header */}
              <div className="bg-[#2F8FFF] px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-white/70 hover:text-white transition-colors"
                    title="Restart"
                    onClick={() => setSimulatorMessages([{ role: "bot", text: "Hi! I'm ready to simulate this outcome. Press \u25b6 to start." }])}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    className="text-white/70 hover:text-white transition-colors"
                    title="Collapse"
                    onClick={() => setSimulatorCollapsed(true)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Connection notice */}
              <div className="px-4 pt-3 pb-1 text-center">
                <p className="text-xs text-[#9AA3B0]">Billie the bot 🎂 has connected to the chat</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {simulatorMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "bot"
                          ? "bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-sm text-[#1E2535] shadow-sm"
                          : "bg-[#2F8FFF] text-white rounded-2xl rounded-tr-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Quick reply suggestions */}
                {simulatorMessages.length <= 1 && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {[
                      { emoji: "🧑", label: "Create account" },
                      { emoji: "🔑", label: "Forgot password" },
                      { emoji: "✉️", label: "Verify email" },
                      { emoji: "🔗", label: "Link Family card" },
                      { emoji: "✏️", label: "Update details" },
                      { emoji: "❓", label: "Account help" },
                    ].map(({ emoji, label }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setSimulatorMessages((prev) => [
                            ...prev,
                            { role: "user", text: label },
                            { role: "bot", text: "Got it! Let me help you with that..." },
                          ])
                        }}
                        className="bg-[#EEF5FF] hover:bg-[#DCE8FF] text-[#2F8FFF] text-xs font-medium rounded-full px-3 py-2.5 text-left transition-colors leading-snug"
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 border-t border-[#DDE5EF]">
                <div className="flex items-center gap-3">
                  <input
                    className="flex-1 text-sm text-[#1E2535] placeholder:text-[#9AA3B0] outline-none bg-transparent"
                    placeholder="Type a message..."
                    value={simulatorInput}
                    onChange={(e) => setSimulatorInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSimulatorSend()}
                  />
                  <button
                    onClick={handleSimulatorSend}
                    className="text-[#9AA3B0] hover:text-[#2F8FFF] transition-colors flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {activeTab === "statements" && (
        <div className="w-1/2 border-r border-[#DDE5EF] overflow-auto p-8 bg-white">
          <div className="max-w-3xl">
            <div className="relative flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-light tracking-tight text-[#1E2535]">Customer Statements</h2>
              <button
                className="w-5 h-5 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs hover:bg-[#3B4760] transition-colors"
                onMouseEnter={() => setShowStatementsInfo(true)}
                onMouseLeave={() => setShowStatementsInfo(false)}
              >
                i
              </button>

              {showStatementsInfo && (
                <Card className="absolute top-full left-0 right-0 mt-2 p-6 bg-[#3B4760] text-white border-none shadow-xl z-50">
                  <p className="text-sm leading-relaxed">
                    Syndeo automatically matches your customers to an Outcome by using elements of machine learning and
                    natural language processing. You can help Syndeo to understand your outcome's purpose, and your
                    customers, by providing some statements you expect your customers to say when discussing this
                    outcome. The more statements you provide, the more easily Syndeo can match your customers needs to
                    an Outcome.
                  </p>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[#6A738A] text-xs uppercase tracking-wider mb-3 block">STATEMENTS</Label>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter a customer statement..."
                    value={newStatement}
                    onChange={(e) => setNewStatement(e.target.value)}
                    className="flex-1 border-[#DDE5EF] focus:border-[#2F8FFF]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newStatement.trim()) {
                        setStatements([...statements, { text: newStatement.trim(), createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }])
                        setNewStatement("")
                      }
                    }}
                  />
                  <Button
                    className="bg-[#F0F6FF] hover:bg-[#2F8FFF] text-[#6A738A] hover:text-white px-6"
                    onClick={() => {
                      if (newStatement.trim()) {
                        setStatements([...statements, { text: newStatement.trim(), createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }])
                        setNewStatement("")
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className="rounded-xl border border-[#DDE5EF] overflow-hidden">
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col className="w-[70%]" />
                    <col className="w-[30%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[#DDE5EF] bg-[#F6F8FA]">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6A738A]">Statement</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6A738A]">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map((statement, index) => (
                      <tr key={index} className="border-b border-[#DDE5EF] last:border-0 hover:bg-[#F6F8FA] transition-colors group">
                        <td className="px-4 py-3 text-[#1E2535]">{statement.text}</td>
                        <td className="px-4 py-3 text-[#6A738A] flex items-center justify-between">
                          {statement.createdAt}
                          <button
                            onClick={() => setStatements(statements.filter((_, i) => i !== index))}
                            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-[#6A738A] text-white flex items-center justify-center hover:bg-[#3B4760] transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-end items-center gap-2 pt-4">
                <Button variant="outline" size="icon" className="h-8 w-8 border-[#DDE5EF] bg-transparent">
                  «
                </Button>
                <div className="w-8 h-8 rounded bg-[#2F8FFF] text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 border-[#DDE5EF] bg-transparent">
                  »
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <div className="w-1/2 border-r border-[#DDE5EF] overflow-auto p-8 bg-white">
          <div className="max-w-3xl">
            <div className="relative flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-light tracking-tight text-[#1E2535]">Outcome Details</h2>
              <button
                className="w-5 h-5 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs hover:bg-[#3B4760] transition-colors"
                onMouseEnter={() => setShowDetailsInfo(true)}
                onMouseLeave={() => setShowDetailsInfo(false)}
              >
                i
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <Button className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white px-6 h-8 text-sm">Save</Button>
                <Button variant="link" className="text-red-600 hover:text-red-700 px-0 h-8 text-sm">
                  Delete Outcome
                </Button>
              </div>

              {showDetailsInfo && (
                <Card className="absolute top-full left-0 right-0 mt-2 p-6 bg-[#3B4760] text-white border-none shadow-xl z-50">
                  <p className="text-sm leading-relaxed">
                    Outcomes are business functions you wish to expose to your customers via Syndeo's. Typically, an
                    outcome aligns with your business intentions. Example outcomes could be "renew customer
                    subscription", "check for an outage" or "recover lost account". We make serving these outcomes to
                    your customers easy by translating the business process for you.
                  </p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-[#6A738A] text-xs uppercase tracking-wider mb-3 block">NAME</Label>
                <Input
                  defaultValue={outcomeName}
                  className="border-[#DDE5EF] bg-[#F6F8FA] focus:border-[#2F8FFF] focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-[#6A738A] text-xs uppercase tracking-wider">DISPLAY ALIAS</Label>
                  <button className="w-4 h-4 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs">
                    i
                  </button>
                </div>
                <Input
                  defaultValue="1 a"
                  className="border-[#DDE5EF] bg-[#F6F8FA] focus:border-[#2F8FFF] focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-[#6A738A] text-xs uppercase tracking-wider">CONFIRMATION QUESTION</Label>
                  <button className="w-4 h-4 rounded-full bg-[#6A738A] text-white flex items-center justify-center text-xs">
                    i
                  </button>
                </div>
                <div className="border border-[#DDE5EF] rounded-xl bg-[#F6F8FA]">
                  <div className="flex gap-2 p-2 border-b border-[#DDE5EF] bg-white rounded-t-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Strikethrough className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-8 bg-[#F0F6FF]" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F0F6FF]">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    rows={8}
                    className="border-none bg-transparent focus:ring-0 resize-none"
                    placeholder="Enter confirmation question..."
                  />
                  <div className="px-3 py-2 text-xs text-[#6A738A] text-right border-t border-[#DDE5EF] bg-white rounded-b-lg">
                    0 of 2000 characters
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#6A738A] text-xs uppercase tracking-wider mb-3 block">DESCRIPTION</Label>
                <Textarea rows={6} className="border-[#DDE5EF] bg-[#F6F8FA] focus:border-[#2F8FFF] focus:bg-white" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-[#6A738A] text-xs uppercase tracking-wider">CUSTOM DATA FIELDS</Label>
                  <Button size="icon" className="h-10 w-10 rounded bg-[#2F8FFF] hover:bg-[#2680E8] text-white">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-[#6A738A] text-xs uppercase tracking-wider mb-3 block">INTENTS</Label>
                <div className="flex gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 bg-[#2F8FFF] text-white rounded px-4 py-2 text-sm font-medium">
                    1 a - Tany
                  </div>
                  <Input
                    placeholder="Add an intent"
                    className="flex-1 border-[#DDE5EF] bg-[#F6F8FA] focus:border-[#2F8FFF]"
                  />
                  <Button size="icon" className="h-10 w-10 rounded bg-[#2F8FFF] hover:bg-[#2680E8] text-white">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      </div>

      {/* Drag ghost — follows cursor */}
      {dragGhost && (() => {
        const ghostNode = nodeTypes.find((nt) => nt.type === dragGhost.type)
        const GhostIcon = ghostNode?.icon || MessageSquare
        return (
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{ left: dragGhost.x + 12, top: dragGhost.y + 12 }}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-2xl border opacity-90 transition-all ${replaceTarget ? "border-orange-400 scale-105" : snapTarget ? "border-white scale-105" : "border-white/20"}`}
              style={{ backgroundColor: ghostNode?.color ?? "#3B4760" }}
            >
              <GhostIcon className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-sm font-medium text-white">{ghostNode?.label}</span>
              {replaceTarget && <span className="text-[10px] text-orange-300 ml-1">replace</span>}
              {!replaceTarget && snapTarget && <span className="text-[10px] text-white/70 ml-1">auto-connect</span>}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
