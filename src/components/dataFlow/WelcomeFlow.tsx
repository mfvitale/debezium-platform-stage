
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  Node,
  EdgeChange,
  Edge,
  Connection,
  Background,
} from "reactflow";
// import AddTransformationNode from "./AddTransformationNode";

import DataNode from "./DataNode";

import { MdLogin, MdLogout } from "react-icons/md";
import DataNodeSelector from "./DataNodeSelector";
import { Button, Modal, ModalBody, ModalHeader } from "@patternfly/react-core";
import { Destination, Source } from "../../apis/apis";
import { PlusIcon } from "@patternfly/react-icons";
import "./CreationFlow.css";
import SourcePipelineModel from "./SourcePipelineModel";
import DestinationPipelineModel from "./DestinationPipelineModel";
import CustomEdgeDestination from "./CustomEdgeDestination";
import CustomEdgeSource from "./CustomEdgeSource";
import { useData } from "../../appLayout/AppContext";
import { AppColors } from "@utils/constants";
import DebeziumNode from "./DebeziumNode";

const nodeTypes = {
  dataNodeSelector: DataNodeSelector,
  addTransformation: DebeziumNode,
  dataNode: DataNode,
};

const edgeTypes = {
  customEdgeSource: CustomEdgeSource,
  customEdgeDestination: CustomEdgeDestination,
};

const proOptions = { hideAttribution: true };

interface WelcomeFlowProps {
  updateIfSourceConfigured: (isConfigured: boolean) => void;
  updateIfDestinationConfigured: (isConfigured: boolean) => void;
  isSourceConfigured: boolean;
  isDestinationConfigured: boolean;
  updateSelectedSource: (source: Source) => void;
  updateSelectedDestination: (destination: Destination) => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({
  updateIfSourceConfigured,
  updateIfDestinationConfigured,
  isSourceConfigured,
  isDestinationConfigured,
  updateSelectedSource,
  updateSelectedDestination,
}) => {

  const { darkMode } = useData();
  
  const [updatedSourceNodes, setUpdatedSourceNodes] = useState<any>();
  const [updatedDestinationNodes, setUpdatedDestinationNodes] = useState<any>();

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);

  const handleSourceModalToggle = useCallback(() => {
    setIsSourceModalOpen(!isSourceModalOpen);
  }, [isSourceModalOpen]);

  const handleDestinationModalToggle = useCallback(() => {
    setIsDestinationModalOpen(!isDestinationModalOpen);
  }, [isDestinationModalOpen]);

  const defaultSourceNode = useMemo(() => {
    return {
      id: "source",
      data: {
        icon: MdLogout,
        label: "Source",
        type: "source",
        action: (
          <Button
            variant="link"
            onClick={handleSourceModalToggle}
            style={{ paddingRight: 10, paddingLeft: 10, fontSize: ".8em" }}
            icon={<PlusIcon />}
            size="sm"
          >
            Source
          </Button>
        ),
      },
      position: { x: 100, y: 150 },
      type: "dataNodeSelector",
      draggable: false,
    };
  }, [handleSourceModalToggle]);

  const defaultTransformationNode = useMemo(() => {
    return {
      id: "add_transformation",
      data: {
        label: "Transformation",
        sourcePosition: "right",
        targetPosition: "left",
      },
      position: { x: 330, y: 130 },
      targetPosition: "left",
      type: "addTransformation",
      draggable: false,
    };
  }, []);

  const defaultDestinationNode = useMemo(() => {
    return {
      id: "destination",
      data: {
        icon: MdLogin,
        label: "Destination",
        type: "destination",
        action: (
          <Button
            variant="link"
            onClick={handleDestinationModalToggle}
            style={{ paddingRight: 10, paddingLeft: 10, fontSize: ".8em" }}
            icon={<PlusIcon />}
            size="sm"
          >
            Destination
          </Button>
        ),
      },
      position: { x: 500, y: 150 },
      type: "dataNodeSelector",
      draggable: false,
    };
  }, [handleDestinationModalToggle]);

  const initialNodes = [
    defaultSourceNode,
    defaultTransformationNode,
    defaultDestinationNode,
  ];

  const initialEdges = [
    {
      id: "source-add_transformation",
      source: "source",
      target: "add_transformation",
      type: "customEdgeSource",
      sourceHandle: "a",
    },
    {
      id: "add_transformation-destination",
      source: "add_transformation",
      target: "destination",
      type: "customEdgeDestination",
    },
  ];

  const [nodes, setNodes] = useState<any>(initialNodes);
  const [edges, setEdges] = useState<any>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds: Edge[]) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onSourceSelection = useCallback(
    (source: Source) => {
      const selectedSourceNode = {
        id: "source",
        data: {
          connectorType: source.type,
          label: source.name,
          type: "source",
          draggable: false,
          editAction: () => setIsSourceModalOpen(true),
        },
        position: { x: 100, y: 150 },
        type: "dataNode",
        draggable: false,
      };
      updateIfSourceConfigured(true);
      setUpdatedSourceNodes(selectedSourceNode);
      updateSelectedSource(source);

      const destinationNode = isDestinationConfigured
        ? updatedDestinationNodes
        : defaultDestinationNode;

      // Update the nodes
      setNodes([
        selectedSourceNode,
        defaultTransformationNode,
        destinationNode,
      ]);

      handleSourceModalToggle();
    },
    [
      defaultTransformationNode,
      defaultDestinationNode,
      updateIfSourceConfigured,
      isDestinationConfigured,
      updatedDestinationNodes,
      updateSelectedSource,
      handleSourceModalToggle,
    ]
  );

  const onDestinationSelection = useCallback(
    (destination: Destination) => {
      const selectedDestinationNode = {
        id: "destination",
        data: {
          connectorType: destination.type,
          label: destination.name,
          type: "destination",
          draggable: false,
          editAction: () => setIsDestinationModalOpen(true),
        },
        position: { x: 500, y: 150 },
        type: "dataNode",
        draggable: false,
      };

      updateIfDestinationConfigured(true);
      setUpdatedDestinationNodes(selectedDestinationNode);
      updateSelectedDestination(destination);

      const sourceNode = isSourceConfigured
        ? updatedSourceNodes
        : defaultSourceNode;

      // Update the nodes
      setNodes([
        sourceNode,
        defaultTransformationNode,
        selectedDestinationNode,
      ]);

      handleDestinationModalToggle();
    },
    [
      defaultTransformationNode,
      defaultSourceNode,
      updateIfDestinationConfigured,
      isSourceConfigured,
      updatedSourceNodes,
      updateSelectedDestination,
      handleDestinationModalToggle,
    ]
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        fitView
        maxZoom={1.4}
        minZoom={1.4}
        panOnDrag={false}
      >
        <Background
          style={{
            borderRadius: "5px",
          }}
          gap={15}
          color={darkMode ? AppColors.dark: AppColors.white}
        />
        <svg>
          <defs>
            <linearGradient id="edge-gradient-source">
              <stop offset="0%" stopColor="#a5c82d" />
              <stop offset="100%" stopColor="#7fc5a5" />
            </linearGradient>
            <linearGradient id="edge-gradient-destination">
              <stop offset="0%" stopColor="#7fc5a5" />
              <stop offset="100%" stopColor="#58b2da" />
            </linearGradient>
          </defs>
        </svg>
      </ReactFlow>
      <Modal
        isOpen={isSourceModalOpen}
        onClose={handleSourceModalToggle}
        aria-labelledby="modal-source-body-with-description"
        aria-describedby="modal-source-body-with-description"
      >
        <ModalHeader
          title="Pipeline source"
          className="pipeline_flow-modal_header"
          labelId="modal-with-source-description-title"
          description="Select a source to be used in pipeline from the list of already configured source listed below or configure a new source by selecting create a new source radio card."
        />

        <ModalBody tabIndex={0} id="modal-source-body-with-description">
          <SourcePipelineModel onSourceSelection={onSourceSelection} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isDestinationModalOpen}
        onClose={handleDestinationModalToggle}
        aria-labelledby="modal-with-description-title"
        aria-describedby="modal-box-body-destination-with-description"
      >
        <ModalHeader
          title="Pipeline destination"
          className="pipeline_flow-modal_header"
          labelId="modal-with-destination-description-title"
          description="Select a destination to be used in pipeline from the list of already configured destination listed below or configure a new destination by selecting create a new destination radio card."
        />

        <ModalBody
          tabIndex={0}
          id="modal-box-body-destination-with-description"
        >
          <DestinationPipelineModel
            onDestinationSelection={onDestinationSelection}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default WelcomeFlow;