import { View, div } from "gpui-kit";
import { h_flex } from "gpui-base";
import { agents, checking, run, setBadge, theme } from "herdr";

export default class DockBadge extends View {
  render() {
    const t = theme();
    const list = agents();
    const blocked = list.filter((a) => a.status === "blocked");
    const done = list.filter((a) => a.status === "done");
    const waiting = [...blocked, ...done];
    const count = waiting.length;

    // The Dock badge is app-wide, so set it when the count changes rather than on
    // every render. Both blocked and done agents are waiting for the person.
    const badge = count === 0 ? null : count > 99 ? "99+" : String(count);
    if (!checking() && badge !== this.badge) {
      this.badge = badge;
      setBadge(badge);
    }

    const label =
      count === 0
        ? "All agents clear"
        : blocked.length > 0 && done.length > 0
          ? `${blocked.length} need you · ${done.length} done`
          : blocked.length > 0
            ? `${blocked.length} need you`
            : `${done.length} done`;

    const color = blocked.length > 0 ? t.blocked : count > 0 ? t.done : t.dim;

    return h_flex()
      .id("dock-badge")
      .size_full()
      .px(12)
      .gap(8)
      .items_center()
      .bg(t.chrome)
      .border_t(1)
      .border_color(t.border)
      .text_size(11.8)
      .text_color(t.muted)
      .when(count > 0, (el) =>
        el.on_click(() => run("agent.focus", { terminal: waiting[0].address })),
      )
      .child(div().size(6).rounded(3).bg(color))
      .child(div().text_color(count > 0 ? t.foreground : t.dim).child(label))
      .child(div().flex_1())
      .when(count > 0, (el) =>
        el.child(div().text_color(t.dim).child("Click to go to the first one")),
      );
  }
}
