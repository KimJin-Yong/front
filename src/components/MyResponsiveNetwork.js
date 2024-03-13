import { ResponsiveNetwork } from "@nivo/network";

export function MyResponsiveNetwork(props) {
  return (
    <ResponsiveNetwork
      data={props.data}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      linkDistance={function (e) {
        return e.distance * 2;
      }}
      centeringStrength={0.3}
      repulsivity={10}
      nodeSize={function (n) {
        return n.size * 2;
      }}
      activeNodeSize={function (n) {
        return 2.5 * n.size;
      }}
      nodeColor={function (e) {
        return e.color;
      }}
      nodeBorderWidth={1}
      nodeBorderColor={{
        from: "color",
        modifiers: [["darker", 0.8]]
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