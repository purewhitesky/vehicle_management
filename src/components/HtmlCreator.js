let markerHeight = 30,
  markerRadius = 10,
  linearOffset = 25;
export const popupOffsets = {
  top: [0, 0],
  "top-left": [0, 0],
  "top-right": [0, 0],
  bottom: [0, -markerHeight],
  "bottom-left": [
    linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  "bottom-right": [
    -linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
};

export const elementCreator = () => {
  const generator = (innerHTML) => {
    const parser = new DOMParser();
    const testElement = parser.parseFromString(innerHTML, "text/html");
    return testElement.body;
  };

  return {
    element: (innerHTML) => {
      return generator(innerHTML);
    },
    button: (innerHTML, onClickCallBack) => {
      const btn = generator(innerHTML);
      btn.addEventListener("click", onClickCallBack);
      return btn;
    },
  };
};
