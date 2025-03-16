import TimelineApp from "../TimelineApp.js";

describe("parseCoordinates", () => {
  let timelineApp;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="text-input" />
      <button id="audio-btn"></button>
      <button id="video-btn"></button>
      <div id="modal">
        <input id="coords-input" />
        <button id="cancel-btn"></button>
        <button id="ok-btn"></button>
      </div>
      <video id="video-recorder"></video>
      <span id="timer"></span>
      <button id="ok-btn-record"></button>
      <button id="cancel-btn-record"></button>
    `;
    timelineApp = new TimelineApp();
  });

  it("should correctly handle input with space", () => {
    const input = "51.50851, −0.12572";
    const result = timelineApp.parseCoordinates(input);
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  it("should correctly handle input without space", () => {
    const input = "51.50851,−0.12572";
    const result = timelineApp.parseCoordinates(input);
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  it("should correctly handle input with square brackets", () => {
    const input = "[51.50851, −0.12572]";
    const result = timelineApp.parseCoordinates(input);
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  it("should throw an exception on invalid format", () => {
    const invalidInputs = [
      "51.50851; −0.12572",
      "51.50851, −0.12572, 123",
      "51.50851",
      "abc, def",
    ];
    invalidInputs.forEach((input) => {
      expect(() => timelineApp.parseCoordinates(input)).toThrow(
        "Invalid coordinates format",
      );
    });
  });

  it("should return null for empty input", () => {
    const input = "";
    const result = timelineApp.parseCoordinates(input);
    expect(result).toBeNull();
  });

  it("should return null for input with only spaces", () => {
    const input = "   ";
    const result = timelineApp.parseCoordinates(input);
    expect(result).toBeNull();
  });
});
