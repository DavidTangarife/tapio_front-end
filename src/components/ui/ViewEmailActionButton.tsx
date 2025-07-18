import { ViewEmailActionButtonProps } from "../../types/types";

const ViewEmailActionButton = ({
  icon: Icon,
  text,
  iconSx = {},
  onClick,
  style
}: ViewEmailActionButtonProps) => {
  return (
    <>
      <button className="email-view-btn" onClick={onClick} style={style}>
        <Icon sx={{ color: "#86DD14", ...iconSx }} />
        {text}
      </button >
    </>
  );
};
export default ViewEmailActionButton;
