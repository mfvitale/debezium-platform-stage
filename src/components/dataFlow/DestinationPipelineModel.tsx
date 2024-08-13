import {
  Split,
  SplitItem,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Divider,
  Text,
  TextContent,
} from "@patternfly/react-core";
import React, { useCallback, useState } from "react";
import { Destination } from "../../apis/apis";
import DestinationSelectionList from "../../components/DestinationSelectionList";
import { CreateDestinationForm } from "../../pages/Destination/CreateDestinationForm";
import { DestinationCatalogGrid } from "../../pages/Destination/DestinationCatalogGrid";

type DestinationPipelineModelProps = {
  onDestinationSelection: (destination: Destination) => void;
};

const DestinationPipelineModel: React.FC<DestinationPipelineModelProps> = ({
  onDestinationSelection,
}) => {
  const id1 = "pipeline-destination-select";
  const id2 = "pipeline-destination-create";
  const [isCreateChecked, setIsCreateChecked] = useState(id1);
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const selectDestination = useCallback(
    (destinationId: string) => {
      setSelectedDestination(destinationId);
    },
    [setSelectedDestination]
  );

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setIsCreateChecked(event.currentTarget.id);
  };

  return (
    <>
      <Split hasGutter>
        <SplitItem className="creation_flow-card_selection">
          <Card
            id="select-existing-destination"
            isSelectable
            isSelected={isCreateChecked === id1}
          >
            <CardHeader
              selectableActions={{
                selectableActionId: id1,
                selectableActionAriaLabelledby: "select-existing-destination",
                name: "pipeline-destination",
                variant: "single",
                onChange,
              }}
            >
              <CardTitle>Select a destination</CardTitle>
            </CardHeader>
            <CardBody>
              Select a already configured destination from the list below
            </CardBody>
          </Card>
        </SplitItem>

        <SplitItem className="creation_flow-card_selection">
          <Card
            id="create-new-destination"
            isSelectable
            isSelected={isCreateChecked === id2}
          >
            <CardHeader
              selectableActions={{
                selectableActionId: id2,
                selectableActionAriaLabelledby: "create-new-destination",
                name: "pipeline-destination",
                variant: "single",
                onChange,
              }}
            >
              <CardTitle>Create a destination</CardTitle>
            </CardHeader>
            <CardBody>
              Create a new destination for your data pipeline.
            </CardBody>
          </Card>
        </SplitItem>
      </Split>
      <Divider style={{ marginTop: "10px" }} />
      {isCreateChecked === id2 &&
        (selectedDestination === "" ? (
          <TextContent style={{ padding: "10px" }}>
            <Text component="p">
              <b>
                Select the type of destination you want to connect from the list
                below, once you select a connector you can configure it using
                form or smart editor option.
              </b>
            </Text>
          </TextContent>
        ) : (
          <TextContent style={{ padding: "10px" }}>
            <Text component="p">
              <b>
                Fill out the below form or use the smart editor to setup a new
                destination connector. If you already have a configuration file,
                you can setup a new destination connector by uploading it in the
                smart editor.
              </b>
            </Text>
          </TextContent>
        ))}

      {isCreateChecked === id1 ? (
        <DestinationSelectionList
          tableType="destination"
          onSelection={onDestinationSelection}
        />
      ) : selectedDestination === "" ? (
        <DestinationCatalogGrid selectDestination={selectDestination} />
      ) : (
        <CreateDestinationForm
          destinationId={selectedDestination}
          selectDestination={selectDestination}
        />
      )}
    </>
  );
};

export default DestinationPipelineModel;
