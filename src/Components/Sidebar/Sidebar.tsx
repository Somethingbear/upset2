import * as React from "react";
import { connect } from "react-redux";
import {
  Accordion,
  Menu,
  Card,
  Form,
  Input,
  Checkbox,
  Header,
  Label
} from "semantic-ui-react";
import { AggregateBy } from "../../types/AggregateBy.enum";
import { SortBy } from "../../types/SortBy.enum";
import { UpsetState } from "../../State/UpsetState";
import { RenderConfig } from "../../Data/RenderConfiguration/RenderConfig";
import { Dispatch } from "redux";
import {
  UpdateRenderConfigAction,
  RenderConfigActions
} from "../../State/Reducers/RenderConfig.reducer";
import styles from "./sidebar.module.scss";

interface OwnProps {}

interface StateProps {
  config: RenderConfig;
}

interface DispatchProps {
  changeSortBy: (rc: RenderConfig, sortBy: SortBy) => void;
  changeFirstAggregateBy: (rc: RenderConfig, agg: AggregateBy) => void;
  changeSecondAggregateBy: (rc: RenderConfig, agg: AggregateBy) => void;
  changeMinDegree: (rc: RenderConfig, val: number) => void;
  changeMaxDegree: (rc: RenderConfig, val: number) => void;
  changeFirstOverlapDegree: (rc: RenderConfig, val: number) => void;
  changeSecondOverlapDegree: (rc: RenderConfig, val: number) => void;
  changeEmptyIntersections: (rc: RenderConfig, flag: boolean) => void;
}

interface State {
  activeindex: number;
}

type Props = OwnProps &
  StateProps &
  DispatchProps & {
    updateSortBy: (opt: SortBy) => void;
    updateFirstAggregateBy: (agg: AggregateBy) => void;
    updateSecondAggregateBy: (agg: AggregateBy) => void;
    updateMinDegree: (val: number) => void;
    updateMaxDegree: (val: number) => void;
    updateEmptyIntersections: (flag: boolean) => void;
    updateFirstOverlapDegree: (val: number) => void;
    updateSecondOverlapDegree: (val: number) => void;
  };

class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeindex: 0
    };
  }

  handleClick = (index: number) => {
    const { activeindex } = this.state;

    this.setState({
      activeindex: activeindex === index ? -1 : index
    });
  };

  render() {
    const { activeindex } = this.state;
    const { config } = this.props;

    const aggBy: string[] = [];
    for (let agg in AggregateBy) aggBy.push(agg);

    const sortBy: string[] = [];
    for (let sort in SortBy)
      if (SortBy[sort] !== SortBy.SET) {
        sortBy.push(sort);
      }

    return (
      <Card>
        <Accordion as={Menu} vertical fluid>
          <Menu.Item>
            <Accordion.Title
              className={styles.accordion_title}
              active={activeindex === 0}
              onClick={() => this.handleClick(0)}
              content={
                <>
                  <Header className={styles.remove_margin}>
                    First Aggregation
                  </Header>
                  <Label>{config.firstLevelAggregation}</Label>
                </>
              }
            />
            <Accordion.Content active={activeindex === 0}>
              <Form>
                <Form.Group grouped>
                  {aggBy.map(aggOption => {
                    return (
                      <div key={aggOption}>
                        <Form.Radio
                          key={aggOption}
                          label={aggOption}
                          name="first_aggregate_by"
                          type="radio"
                          value={aggOption}
                          checked={config.firstLevelAggregation === aggOption}
                          disabled={
                            aggOption !== AggregateBy.NONE &&
                            config.secondLevelAggregation === aggOption
                          }
                          onChange={() =>
                            this.props.updateFirstAggregateBy(aggOption as any)
                          }
                        />
                        {aggOption === AggregateBy.OVERLAPS &&
                          config.firstLevelAggregation ===
                            AggregateBy.OVERLAPS && (
                            <Input
                              fluid
                              label="Degree"
                              labelPosition="right"
                              type="number"
                              defaultValue={config.firstOverlap}
                              onChange={e => {
                                const val: number = parseInt(e.target.value);
                                if (val >= 0)
                                  this.props.updateFirstOverlapDegree(val);
                                else e.target.value = "0";
                              }}
                            />
                          )}
                      </div>
                    );
                  })}
                </Form.Group>
              </Form>
            </Accordion.Content>
          </Menu.Item>

          {config.firstLevelAggregation !== AggregateBy.NONE && (
            <Menu.Item>
              <Accordion.Title
                className={styles.accordion_title}
                active={activeindex === 1}
                content={
                  <>
                    <Header className={styles.remove_margin}>
                      Second Aggregation
                    </Header>
                    <Label>{config.secondLevelAggregation}</Label>
                  </>
                }
                onClick={() => this.handleClick(1)}
              />
              <Accordion.Content active={activeindex === 1}>
                <Form>
                  <Form.Group grouped>
                    {aggBy.map(aggOption => {
                      return (
                        <div key={aggOption}>
                          <Form.Radio
                            label={aggOption}
                            name="second_aggregate_by"
                            type="radio"
                            value={aggOption}
                            checked={
                              config.secondLevelAggregation === aggOption
                            }
                            disabled={
                              config.firstLevelAggregation === aggOption
                            }
                            onChange={() => {
                              this.props.updateSecondAggregateBy(
                                aggOption as any
                              );
                            }}
                          />
                          {aggOption === AggregateBy.OVERLAPS &&
                            config.secondLevelAggregation ===
                              AggregateBy.OVERLAPS && (
                              <Input
                                fluid
                                label="Degree"
                                labelPosition="right"
                                type="number"
                                defaultValue={config.secondOverlap}
                                onChange={e => {
                                  const val: number = parseInt(e.target.value);
                                  if (val >= 0)
                                    this.props.updateSecondOverlapDegree(val);
                                  else e.target.value = "0";
                                }}
                              />
                            )}
                        </div>
                      );
                    })}
                  </Form.Group>
                </Form>
              </Accordion.Content>
            </Menu.Item>
          )}

          <Menu.Item>
            <Accordion.Title
              className={styles.accordion_title}
              active={activeindex === 2}
              content={
                <>
                  <Header className={styles.remove_margin}>Sort By</Header>
                  <Label>{config.sortBy}</Label>
                </>
              }
              onClick={() => this.handleClick(2)}
            />
            <Accordion.Content active={activeindex === 2}>
              <Form>
                <Form.Group grouped>
                  {sortBy.map((sort: string) => {
                    return (
                      <Form.Radio
                        key={sort}
                        label={sort}
                        name="sort_by"
                        type="radio"
                        value={sort}
                        checked={config.sortBy === sort}
                        onChange={() =>
                          this.props.updateSortBy(SortBy[sort as any] as SortBy)
                        }
                      />
                    );
                  })}
                </Form.Group>
              </Form>
            </Accordion.Content>
          </Menu.Item>

          <Menu.Item>
            <Accordion.Title
              className={styles.accordion_title}
              active={activeindex === 3}
              content={
                <>
                  <Header className={styles.remove_margin}>Data</Header>
                  <Label>
                    Min <Label.Detail>{config.minDegree}</Label.Detail>
                  </Label>
                  <Label>
                    Max <Label.Detail>{config.maxDegree}</Label.Detail>
                  </Label>
                  <Label>
                    {config.hideEmptyIntersections
                      ? "Empty Hidden"
                      : "Empty Visible"}
                  </Label>
                </>
              }
              onClick={() => this.handleClick(3)}
            />
            <Accordion.Content active={activeindex === 3}>
              <Form>
                <Form.Group grouped>
                  <Form.Field>
                    <Input
                      fluid
                      label="Min Degree"
                      type="number"
                      defaultValue={config.minDegree}
                      onChange={e => {
                        const val: number = parseInt(e.target.value);
                        if (val >= 0) this.props.updateMinDegree(val);
                        else e.target.value = "0";
                      }}
                    />
                  </Form.Field>

                  <Form.Field>
                    <Input
                      fluid
                      label="Max Degree"
                      type="number"
                      defaultValue={config.maxDegree}
                      onChange={e => {
                        const val: number = parseInt(e.target.value);
                        if (val >= 0) this.props.updateMaxDegree(val);
                        else e.target.value = "0";
                      }}
                    />
                  </Form.Field>

                  <Form.Field>
                    <Checkbox
                      label="Hide Empty Intersections"
                      checked={config.hideEmptyIntersections}
                      type="checkbox"
                      onChange={e => {
                        this.props.updateEmptyIntersections(
                          !config.hideEmptyIntersections
                        );
                      }}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Accordion.Content>
          </Menu.Item>
        </Accordion>
      </Card>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => ({
  config: state.renderConfig
});

const mapDispatchToProps = (
  dispatch: Dispatch<UpdateRenderConfigAction>
): DispatchProps => ({
  changeSortBy: (oldRc: RenderConfig, sortBy: SortBy) => {
    const rc = { ...oldRc };
    rc.sortBy = SortBy[sortBy];
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeFirstAggregateBy: (oldRc: RenderConfig, agg: AggregateBy) => {
    const rc = { ...oldRc };
    rc.firstLevelAggregation = AggregateBy[agg];
    if (agg === AggregateBy.NONE) rc.secondLevelAggregation = AggregateBy.NONE;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeSecondAggregateBy: (oldRc: RenderConfig, agg: AggregateBy) => {
    const rc = { ...oldRc };
    rc.secondLevelAggregation = AggregateBy[agg];
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeMinDegree: (oldRc: RenderConfig, val: number) => {
    const rc = { ...oldRc };
    rc.minDegree = val;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeMaxDegree: (oldRc: RenderConfig, val: number) => {
    const rc = { ...oldRc };
    rc.maxDegree = val;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeEmptyIntersections: (oldRc: RenderConfig, flag: boolean) => {
    const rc = { ...oldRc };
    rc.hideEmptyIntersections = flag;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeFirstOverlapDegree: (oldRc: RenderConfig, val: number) => {
    const rc = { ...oldRc };
    rc.firstOverlap = val;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  },
  changeSecondOverlapDegree: (oldRc: RenderConfig, val: number) => {
    const rc = { ...oldRc };
    rc.secondOverlap = val;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  }
});

const mergeProps = (
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  updateSortBy: (sortBy: SortBy) => {
    dispatchProps.changeSortBy(stateProps.config, sortBy);
  },
  updateFirstAggregateBy: (agg: AggregateBy) => {
    dispatchProps.changeFirstAggregateBy(stateProps.config, agg);
  },
  updateSecondAggregateBy: (agg: AggregateBy) => {
    dispatchProps.changeSecondAggregateBy(stateProps.config, agg);
  },
  updateMinDegree: (val: number) => {
    dispatchProps.changeMinDegree(stateProps.config, val);
  },
  updateMaxDegree: (val: number) => {
    dispatchProps.changeMaxDegree(stateProps.config, val);
  },
  updateEmptyIntersections: (flag: boolean) => {
    dispatchProps.changeEmptyIntersections(stateProps.config, flag);
  },
  updateFirstOverlapDegree: (val: number) => {
    dispatchProps.changeFirstOverlapDegree(stateProps.config, val);
  },
  updateSecondOverlapDegree: (val: number) => {
    dispatchProps.changeSecondOverlapDegree(stateProps.config, val);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Sidebar);
