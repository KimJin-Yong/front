import { ResponsiveNetwork } from "@nivo/network";

export function MyResponsiveNetwork(props) {
  return (
    <ResponsiveNetwork
      data={props.data}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      onClick = {(e) => {
        return window.open(`http://localhost:3000/chatbot?paperId=${e.id}`);
      }}
      linkDistance={function (e) {
        return e.distance * 2 + 50;
      }}
      nodeTooltip={(e) => {
        return <a>{e.node.data.title}</a>
      }}
      centeringStrength={0.7}
      repulsivity={15}
      nodeSize={function (n) {
        return n.size * 2;
      }}
      activeNodeSize={function (n) {
        return 2.5 * n.size;
      }}
      inactiveNodeSize={15}
      nodeColor={function (e) {
        return e.color;
      }}
      linkThickness={function (n) {
        return 2 + 2 * n.target.data.height;
      }}
      linkBlendMode="multiply"
      motionConfig="wobbly"
    />
  );
}

export default { MyResponsiveNetwork };