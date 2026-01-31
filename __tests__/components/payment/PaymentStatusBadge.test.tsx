import { fireEvent, render, screen } from '@testing-library/react'

import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge'

describe('PaymentStatusBadge', () => {
  it('renders paid status with price', () => {
    render(
      <PaymentStatusBadge
        paymentStatus="PAID"
        price="199.99"
        paidAt={null}
      />
    )

    expect(screen.getByText('已支付 ¥199.99')).toBeInTheDocument()
  })

  it('renders refunded status with price', () => {
    render(
      <PaymentStatusBadge
        paymentStatus="REFUNDED"
        price="199.99"
        paidAt={null}
      />
    )

    expect(screen.getByText('已退款 ¥199.99')).toBeInTheDocument()
  })

  it('renders pending status without price as quoting', () => {
    render(
      <PaymentStatusBadge
        paymentStatus="PENDING"
        price={null}
        paidAt={null}
      />
    )

    expect(screen.getByText('报价中')).toBeInTheDocument()
  })

  it('renders pending status with price and pay button when onPayClick provided', () => {
    const onPayClick = jest.fn()
    render(
      <PaymentStatusBadge
        paymentStatus="PENDING"
        price="199.99"
        paidAt={null}
        onPayClick={onPayClick}
      />
    )

    expect(screen.getByText('待支付 ¥199.99')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '支付' }))
    expect(onPayClick).toHaveBeenCalledTimes(1)
  })
})

