import { render, screen } from "@testing-library/react";
import RadarChart from "@/components/validator/RadarChart";
import { DIMENSIONS } from "@/components/validator/constants";

jest.mock("next/dynamic", () => {
  return function dynamic(
    loader: () => Promise<{ default: React.ComponentType }>,
    options: { loading?: () => JSX.Element }
  ) {
    const MockComponent = ({ data }: { data: unknown[] }) => (
      <div data-testid="mock-radar-chart" data-items={data.length}>
        Mock Radar Chart
      </div>
    );
    MockComponent.displayName = "DynamicRadarChart";
    return MockComponent;
  };
});

describe("RadarChart Component", () => {
  const mockScores = DIMENSIONS.map((dim) => ({
    key: dim.key,
    value: 5,
  }));

  it("renders chart container", () => {
    render(<RadarChart scores={mockScores} />);

    expect(screen.getByTestId("mock-radar-chart")).toBeInTheDocument();
  });

  it("transforms scores data to radar format with correct item count", () => {
    render(<RadarChart scores={mockScores} />);

    const chart = screen.getByTestId("mock-radar-chart");
    expect(chart).toHaveAttribute("data-items", "5");
  });

  it("applies custom className", () => {
    const { container } = render(
      <RadarChart scores={mockScores} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has default height of 300px", () => {
    const { container } = render(<RadarChart scores={mockScores} />);

    expect(container.firstChild).toHaveClass("h-[300px]");
  });

  it("has full width", () => {
    const { container } = render(<RadarChart scores={mockScores} />);

    expect(container.firstChild).toHaveClass("w-full");
  });

  it("handles empty scores array", () => {
    render(<RadarChart scores={[]} />);

    expect(screen.getByTestId("mock-radar-chart")).toBeInTheDocument();
  });

  it("handles partial scores", () => {
    const partialScores = [{ key: "clarity", value: 8 }];
    render(<RadarChart scores={partialScores} />);

    const chart = screen.getByTestId("mock-radar-chart");
    expect(chart).toHaveAttribute("data-items", "5");
  });
});
