export const swipeCellBehavior = Behavior({
  data: {
    swipeCellQueue: [],
  },
  methods: {
    onSwipeCellOpen(e) {
      const instance = this.selectComponent(`#${e.target.id}`);
      this.data.swipeCellQueue.push(instance);
    },
    onSwipeCellClick() {
      this.onSwipeCellCommonClick();
    },
    onSwipeCellPage() {
      this.onSwipeCellCommonClick();
    },
    onSwipeCellCommonClick() {
      this.data.swipeCellQueue.forEach((instance) => {
        instance.close();
      });
    },
  },
});
