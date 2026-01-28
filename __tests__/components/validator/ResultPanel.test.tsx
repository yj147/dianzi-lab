import { render, screen, fireEvent } from "@testing-library/react";
import ResultPanel from "@/components/validator/ResultPanel";
import type { ValidationResult } from "@/components/validator/types";

describe("ResultPanel Component", () => {
  const mockResult: ValidationResult = {
    overallScore: 72,
    feedback: [
      { type: "success", message: "目标用户定位清晰" },
      { type: "warning", message: "市场竞争较为激烈，建议进一步差异化" },
      { type: "error", message: "预算不足，可能影响项目启动" },
    ],
    scores: [
      { key: "targetUser", value: 9 },
      { key: "market", value: 6 },
    ],
  };

  const mockOnReset = jest.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  it("displays empty state when result is null", () => {
    render(<ResultPanel result={null} />);

    expect(screen.getByText(/完成评估后/)).toBeInTheDocument();
  });

  it("displays overall score", () => {
    render(<ResultPanel result={mockResult} />);

    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("综合评分")).toBeInTheDocument();
    expect(screen.getByText("满分 100")).toBeInTheDocument();
  });

  it("renders success feedback with correct styling", () => {
    const { container } = render(<ResultPanel result={mockResult} />);

    expect(screen.getByText("目标用户定位清晰")).toBeInTheDocument();
    expect(container.querySelector('svg[data-lucide="CheckCircle2"]')).toBeInTheDocument();
  });

  it("renders warning feedback with correct styling", () => {
    const { container } = render(<ResultPanel result={mockResult} />);

    expect(
      screen.getByText(/市场竞争较为激烈/)
    ).toBeInTheDocument();
    expect(container.querySelector('svg[data-lucide="AlertTriangle"]')).toBeInTheDocument();
  });

  it("renders error feedback with correct styling", () => {
    const { container } = render(<ResultPanel result={mockResult} />);

    expect(screen.getByText(/预算不足/)).toBeInTheDocument();
    expect(container.querySelector('svg[data-lucide="XCircle"]')).toBeInTheDocument();
  });

  it("shows skeleton when isLoading is true", () => {
    const { container } = render(<ResultPanel result={null} isLoading={true} />);

    expect(container.querySelector(".bg-gray-200")).toBeTruthy();
  });

  it("renders reset button when onReset is provided", () => {
    render(<ResultPanel result={mockResult} onReset={mockOnReset} />);

    expect(screen.getByRole("button", { name: /重新评估/i })).toBeInTheDocument();
  });

  it("does not render reset button when onReset is not provided", () => {
    render(<ResultPanel result={mockResult} />);

    expect(screen.queryByRole("button", { name: /重新评估/i })).not.toBeInTheDocument();
  });

  it("calls onReset when reset button is clicked", () => {
    render(<ResultPanel result={mockResult} onReset={mockOnReset} />);

    const resetButton = screen.getByRole("button", { name: /重新评估/i });
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("disables reset button when isLoading is true", () => {
    render(
      <ResultPanel result={mockResult} onReset={mockOnReset} isLoading={true} />
    );

    // 加载状态下显示骨架屏，不显示按钮
    expect(screen.queryByRole("button", { name: /重新评估/i })).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ResultPanel result={mockResult} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles result with empty feedback array", () => {
    const emptyFeedbackResult: ValidationResult = {
      ...mockResult,
      feedback: [],
    };
    render(<ResultPanel result={emptyFeedbackResult} />);

    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.queryByText("评估反馈")).not.toBeInTheDocument();
  });

  it("has glassmorphism styling", () => {
    const { container } = render(<ResultPanel result={mockResult} />);

    expect(container.firstChild).toHaveClass("border-2");
    expect(container.firstChild).toHaveClass("border-brand-dark");
    expect(container.firstChild).toHaveClass("bg-brand-surface");
    expect(container.firstChild).toHaveClass("shadow-solid-sm");
  });
});
