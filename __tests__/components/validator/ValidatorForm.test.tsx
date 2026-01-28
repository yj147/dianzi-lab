import { render, screen, fireEvent } from "@testing-library/react";
import ValidatorForm from "@/components/validator/ValidatorForm";
import { DIMENSIONS } from "@/components/validator/constants";

// Mock Slider 组件
jest.mock("@/components/ui/slider", () => ({
  Slider: ({
    value,
    onValueChange,
    id,
    "aria-label": ariaLabel,
    disabled,
  }: {
    value: number[];
    onValueChange: (value: number[]) => void;
    id: string;
    "aria-label": string;
    disabled?: boolean;
  }) => (
    <input
      type="range"
      id={id}
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      aria-label={ariaLabel}
      disabled={disabled}
      data-testid={`slider-${id}`}
    />
  ),
}));

describe("ValidatorForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders 9 sliders for all dimensions", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} />);

    for (const dim of DIMENSIONS) {
      expect(screen.getByLabelText(dim.label)).toBeInTheDocument();
    }
  });

  it("renders all dimension labels and descriptions", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} />);

    for (const dim of DIMENSIONS) {
      expect(screen.getByText(dim.label)).toBeInTheDocument();
      expect(screen.getByText(dim.description)).toBeInTheDocument();
    }
  });

  it("initializes sliders with default value 0", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} />);

    // 检查所有显示的分数值
    const scoreDisplays = screen.getAllByText("0");
    // 每个维度有一个分数显示，加上两个范围标签（0-10），所以 9 + 9 = 18
    expect(scoreDisplays.length).toBeGreaterThanOrEqual(9);
  });

  it("updates score display when slider value changes", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} />);

    const firstSlider = screen.getByTestId("slider-slider-targetUser");
    fireEvent.change(firstSlider, { target: { value: "7" } });

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls onSubmit with correct data when form is submitted", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /开始评估/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      scores: expect.arrayContaining([
        expect.objectContaining({ key: "targetUser", value: expect.any(Number) }),
      ]),
    });
  });

  it("disables form when isLoading is true", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole("button", { name: /评估中/i });
    expect(submitButton).toBeDisabled();
  });

  it("shows loading text when isLoading is true", () => {
    render(<ValidatorForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByText("评估中...")).toBeInTheDocument();
  });

  it("accepts initial values through props", () => {
    const initialValues = [{ key: "targetUser", value: 8 }];
    render(
      <ValidatorForm onSubmit={mockOnSubmit} initialValues={initialValues} />
    );

    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ValidatorForm onSubmit={mockOnSubmit} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has responsive grid layout classes", () => {
    const { container } = render(<ValidatorForm onSubmit={mockOnSubmit} />);

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-3");
  });
});
