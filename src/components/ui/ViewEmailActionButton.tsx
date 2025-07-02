import { ViewEmailActionButtonProps } from "../../types/types";

const ViewEmailActionButton = ({
  icon: Icon,
  text,
  iconSx = {},
  onClick,
}: ViewEmailActionButtonProps) => {
  return (
    <>
      <button className="email-view-btn" onClick={onClick}>
        <Icon sx={{ color: "#86DD14", ...iconSx }} />
        {text}
      </button>
    </>
  );
};
export default ViewEmailActionButton;
