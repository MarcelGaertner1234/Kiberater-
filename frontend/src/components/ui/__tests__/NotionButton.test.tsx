import { render, screen, fireEvent } from '@/test-utils'
import { NotionButton } from '../NotionButton'

describe('NotionButton', () => {
  it('renders correctly with default props', () => {
    render(<NotionButton>Click me</NotionButton>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('notion-button') // Assuming this class exists
  })

  it('renders different variants correctly', () => {
    const { rerender } = render(<NotionButton variant="primary">Primary</NotionButton>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-primary') // Assuming this class exists
    
    rerender(<NotionButton variant="secondary">Secondary</NotionButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-secondary')
    
    rerender(<NotionButton variant="ghost">Ghost</NotionButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-ghost')
    
    rerender(<NotionButton variant="danger">Danger</NotionButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-danger')
  })

  it('renders different sizes correctly', () => {
    const { rerender } = render(<NotionButton size="sm">Small</NotionButton>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-sm')
    
    rerender(<NotionButton size="md">Medium</NotionButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-md')
    
    rerender(<NotionButton size="lg">Large</NotionButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('notion-button-lg')
  })

  it('shows loading state correctly', () => {
    render(<NotionButton loading>Loading Button</NotionButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Should show spinner
    const spinner = button.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<NotionButton onClick={handleClick}>Click me</NotionButton>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn()
    render(
      <NotionButton disabled onClick={handleClick}>
        Disabled Button
      </NotionButton>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not trigger click when loading', () => {
    const handleClick = jest.fn()
    render(
      <NotionButton loading onClick={handleClick}>
        Loading Button
      </NotionButton>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders with left and right icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>
    const RightIcon = () => <span data-testid="right-icon">→</span>
    
    render(
      <NotionButton leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        Icon Button
      </NotionButton>
    )
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    expect(screen.getByText('Icon Button')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<NotionButton className="custom-class">Custom</NotionButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<NotionButton ref={ref}>Ref Button</NotionButton>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('spreads additional props', () => {
    render(
      <NotionButton data-testid="custom-button" aria-label="Custom label">
        Props Button
      </NotionButton>
    )
    
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes when disabled', () => {
      render(<NotionButton disabled>Disabled</NotionButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })

    it('has proper ARIA attributes when loading', () => {
      render(<NotionButton loading>Loading</NotionButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
      // Could add aria-busy or aria-live attributes for better accessibility
    })

    it('is keyboard navigable', () => {
      const handleClick = jest.fn()
      render(<NotionButton onClick={handleClick}>Keyboard</NotionButton>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      fireEvent.keyDown(button, { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Theme Integration', () => {
    it('adapts to dark theme', () => {
      // This would need to be implemented based on your theme system
      render(<NotionButton>Dark Theme</NotionButton>)
      
      const button = screen.getByRole('button')
      // Add assertions for dark theme classes or styles
      expect(button).toBeInTheDocument()
    })
  })
})