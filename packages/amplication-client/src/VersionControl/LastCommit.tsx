import { useContext } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { Tooltip, Button, EnumButtonStyle } from "@amplication/design-system";
import { ClickableId } from "../Components/ClickableId";
import "./LastCommit.scss";
import { AppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useCommitStatus } from "./hooks/useCommitStatus";
import { CommitBuildsStatusIcon } from "./CommitBuildsStatusIcon";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import useCommit from "./hooks/useCommits";

type Props = {
  projectId: string;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ projectId }: Props) => {
  const { currentWorkspace, currentProject, commitRunning } =
    useContext(AppContext);

  const { lastCommit } = useCommit();

  const { commitStatus } = useCommitStatus(lastCommit);
  if (!lastCommit) return null;

  const ClickableCommitId = (
    <ClickableId
      to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${lastCommit.id}`}
      id={lastCommit.id}
      label="Commit"
      eventData={{
        eventName: AnalyticsEventNames.LastCommitIdClick,
      }}
    />
  );

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}__generating`]: commitRunning,
      })}
    >
      <hr className={`${CLASS_NAME}__divider`} />
      <div className={`${CLASS_NAME}__content`}>
        <p className={`${CLASS_NAME}__title`}>
          Last Commit
          <CommitBuildsStatusIcon commitBuildStatus={commitStatus} />
        </p>

        <div className={`${CLASS_NAME}__status`}>
          <div>
            {isEmpty(lastCommit?.message) ? (
              ClickableCommitId
            ) : (
              <Tooltip aria-label={lastCommit?.message} direction="ne">
                {ClickableCommitId}
              </Tooltip>
            )}
          </div>
          <span className={classNames("clickable-id")}>
            {formatTimeToNow(lastCommit?.createdAt)}
          </span>
        </div>
        {lastCommit && (
          <Link
            to={`/${currentWorkspace?.id}/${currentProject?.id}/code-view`}
            className={`${CLASS_NAME}__view-code`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Secondary}
              disabled={commitRunning}
            >
              Go to view code
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}

export default LastCommit;
