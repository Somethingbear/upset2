import * as React from "react";
import { UpsetState } from "../../State/UpsetState";
import { DatasetDict, Dataset } from "../../types/Dataset.type";
import { connect } from "react-redux";
import { Card, Divider, Header, Icon } from "semantic-ui-react";

type OwnProps = {};
type StateProps = {
  dataset: string;
  datasetDict: DatasetDict;
};
type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const DatasetInfoBox: React.FC<Props> = (props: Props) => {
  const { datasetDict } = props;
  const dataset: Dataset = datasetDict[props.dataset]
    ? datasetDict[props.dataset]
    : ({} as any);

  return (
    <Card color="grey">
      <Card.Content>
        <Header as="h1">Dataset Information</Header>
        <Card.Header>{dataset.name}</Card.Header>
        <Card.Meta>
          <Icon name="user" />
          <span>{dataset.author}</span>
        </Card.Meta>
        <Divider />
        <Card.Description>{dataset.description}</Card.Description>
        <Card.Description>
          <a href={dataset.source}>{dataset.source}</a>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div># Sets: {dataset.setCount}</div>
        <div># Attributes: {dataset.attributeCount}</div>
      </Card.Content>
    </Card>
  );
};

const mapStateToProps = (state: UpsetState): StateProps => {
  return {
    dataset: state.selectedDatasetName,
    datasetDict: state.datasetDict
  };
};

export default connect(mapStateToProps)(DatasetInfoBox);
