import { act, fireEvent, render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/toaster'
import { reducer, toast, useToast } from '@/components/ui/use-toast'

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('三种变体（success/destructive/info）渲染对应颜色类', () => {
    render(<Toaster />)

    const cases = [
      { variant: 'success' as const, className: 'bg-brand-success/15' },
      { variant: 'destructive' as const, className: 'bg-destructive/10' },
      { variant: 'info' as const, className: 'bg-primary/10' },
    ]

    for (const { variant, className } of cases) {
      let instance!: ReturnType<typeof toast>

      act(() => {
        instance = toast({ title: `title-${variant}`, variant })
      })

      const title = screen.getByText(`title-${variant}`)
      const root = title.closest(`.${variant}`)
      expect(root).toBeInTheDocument()
      expect(root).toHaveClass(className)

      act(() => {
        instance.dismiss()
        jest.advanceTimersByTime(1_000_000)
      })

      expect(screen.queryByText(`title-${variant}`)).not.toBeInTheDocument()
    }
  })

  it('toast.update() 可更新已有 toast（覆盖 UPDATE_TOAST 分支）', () => {
    render(<Toaster />)

    let instance!: ReturnType<typeof toast>
    act(() => {
      instance = toast({ title: 'before', variant: 'info' })
    })
    expect(screen.getByText('before')).toBeInTheDocument()

    act(() => {
      instance.update({ title: 'after' } as any)
    })
    expect(screen.getByText('after')).toBeInTheDocument()

    act(() => {
      instance.dismiss()
      jest.advanceTimersByTime(1_000_000)
    })
  })

  it('useToast().dismiss() 不传 id 会关闭全部 toast（覆盖 DISMISS_TOAST else 分支）', () => {
    function Harness() {
      const { toast: pushToast, dismiss } = useToast()
      return (
        <div>
          <button type="button" onClick={() => pushToast({ title: 'from-harness' })}>
            add
          </button>
          <button type="button" onClick={() => dismiss()}>
            dismiss-all
          </button>
        </div>
      )
    }

    render(
      <>
        <Harness />
        <Toaster />
      </>
    )

    fireEvent.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByText('from-harness')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'dismiss-all' }))

    act(() => {
      jest.advanceTimersByTime(1_000_000)
    })

    expect(screen.queryByText('from-harness')).not.toBeInTheDocument()
  })

  it('reducer 覆盖 REMOVE_TOAST(无 toastId) 与 DISMISS_TOAST(有 toastId 的分支)', () => {
    const t1 = { id: 't1', open: true, title: 't1' }
    const t2 = { id: 't2', open: true, title: 't2' }
    const initial = { toasts: [t1, t2] }

    const dismissedOne = reducer(initial as any, { type: 'DISMISS_TOAST', toastId: 't1' } as any)
    expect(dismissedOne.toasts[0].open).toBe(false)
    expect(dismissedOne.toasts[1].open).toBe(true)

    const removedAll = reducer(dismissedOne as any, { type: 'REMOVE_TOAST' } as any)
    expect(removedAll.toasts).toEqual([])
  })

  it('toast() 支持传入 variant 参数并触发延迟移除定时器', () => {
    render(<Toaster />)

    let instance!: ReturnType<typeof toast>

    act(() => {
      instance = toast({ title: 'auto-dismiss', variant: 'success' })
    })

    expect(screen.getByText('auto-dismiss')).toBeInTheDocument()

    act(() => {
      instance.dismiss()
    })

    act(() => {
      jest.advanceTimersByTime(1_000_000)
    })

    expect(screen.queryByText('auto-dismiss')).not.toBeInTheDocument()
  })

  it('可手动关闭 toast', () => {
    render(<Toaster />)

    act(() => {
      toast({ title: 'manual-close', variant: 'info' })
    })

    expect(screen.getByText('manual-close')).toBeInTheDocument()

    const closeButton = document.querySelector('button[toast-close]')
    expect(closeButton).toBeInTheDocument()

    fireEvent.click(closeButton as HTMLElement)

    act(() => {
      jest.advanceTimersByTime(1_000_000)
    })

    expect(screen.queryByText('manual-close')).not.toBeInTheDocument()
  })

  it('重复 dismiss 同一个 toast 不应重复入队（覆盖 addToRemoveQueue 早返回分支）', () => {
    render(<Toaster />)

    let instance!: ReturnType<typeof toast>
    act(() => {
      instance = toast({ title: 'double-dismiss', variant: 'success' })
    })

    act(() => {
      instance.dismiss()
      instance.dismiss()
      jest.advanceTimersByTime(1_000_000)
    })

    expect(screen.queryByText('double-dismiss')).not.toBeInTheDocument()
  })
})
