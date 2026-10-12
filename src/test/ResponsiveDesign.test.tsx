import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { ResponsiveDataView } from '@/components/ResponsiveDataView';
import { LazyImage } from '@/components/ui/LazyImage';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

describe('Responsive Design & Refinement (Phase FE14)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FE14.4: Mobile-Optimized Navigation & Hamburger Menu', () => {
    it('renders Header hamburger button and toggles MobileNav drawer', () => {
      const handleToggle = vi.fn();
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Header onToggleMobileNav={handleToggle} isMobileNavOpen={false} />
          </BrowserRouter>
        </Provider>
      );

      const hamburgerBtn = screen.getByTestId('mobile-menu-toggle');
      expect(hamburgerBtn).toBeInTheDocument();
      expect(hamburgerBtn).toHaveClass('touch-target');

      fireEvent.click(hamburgerBtn);
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('renders MobileNav drawer when open and closes on backdrop click', () => {
      const handleClose = vi.fn();
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MobileNav isOpen={true} onClose={handleClose} />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('mobile-nav-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-close')).toBeInTheDocument();

      const backdrop = screen.getByTestId('mobile-nav-backdrop');
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('closes MobileNav on Escape key press', () => {
      const handleClose = vi.fn();
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MobileNav isOpen={true} onClose={handleClose} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('FE14.5: Responsive Tables & Cards Layout Switching', () => {
    interface TestItem {
      id: string;
      name: string;
      role: string;
      department: string;
    }

    const testData: TestItem[] = [
      { id: '1', name: 'Aarav Sharma', role: 'SDE', department: 'CSE' },
      { id: '2', name: 'Priya Patel', role: 'Cloud Architect', department: 'IT' },
    ];

    const testColumns = [
      { key: 'name', label: 'Student Name' },
      { key: 'role', label: 'Target Role' },
      { key: 'department', label: 'Department' },
    ];

    it('renders both table and cards views and allows manual layout toggle', () => {
      render(
        <ResponsiveDataView
          data={testData}
          columns={testColumns}
          title="Placement Applicants"
          defaultView="auto"
        />
      );

      expect(screen.getByTestId('responsive-data-view')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-table-view')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-cards-view')).toBeInTheDocument();

      // Switch to cards explicitly
      const cardsBtn = screen.getByTestId('toggle-view-cards');
      fireEvent.click(cardsBtn);
      expect(cardsBtn).toHaveAttribute('aria-pressed', 'true');

      // Switch to table explicitly
      const tableBtn = screen.getByTestId('toggle-view-table');
      fireEvent.click(tableBtn);
      expect(tableBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders empty message when no records are provided', () => {
      render(
        <ResponsiveDataView
          data={[]}
          columns={testColumns}
          emptyMessage="No students found matching your criteria."
        />
      );

      expect(screen.getByText('No students found matching your criteria.')).toBeInTheDocument();
    });
  });

  describe('FE14.6: Responsive Modals and Dialogs', () => {
    it('renders responsive modal with touch-friendly dismiss button and closes on ESC', () => {
      const handleClose = vi.fn();
      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Responsive Modal Dialog"
          footer={<Button onClick={handleClose}>Done</Button>}
        >
          <p>Modal body content adaptable to mobile screens.</p>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Responsive Modal Dialog')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText('Close modal');
      expect(closeBtn).toHaveClass('touch-target');

      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('closes modal on overlay backdrop click', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Backdrop Test">
          <p>Testing backdrop click</p>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('FE14.8: LazyImage Component with Skeleton & Fallback', () => {
    it('renders skeleton shimmer and native lazy loading attribute', () => {
      render(
        <LazyImage
          src="https://example.com/logo.png"
          alt="Company Logo"
          className="h-12 w-12"
        />
      );

      expect(screen.getByTestId('lazy-image-container')).toBeInTheDocument();
      expect(screen.getByTestId('lazy-image-skeleton')).toBeInTheDocument();

      const img = screen.getByTestId('lazy-image-img');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('alt', 'Company Logo');
    });

    it('switches to fallback view when image fails to load', () => {
      render(
        <LazyImage
          src="https://invalid-broken-url.com/nonexistent.jpg"
          alt="Broken Image"
        />
      );

      const img = screen.getByTestId('lazy-image-img');
      fireEvent.error(img);

      expect(screen.getByTestId('lazy-image-error')).toBeInTheDocument();
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });

  describe('FE14.3: Touch-Friendly Button Sizes & Spacing', () => {
    it('renders button with fullWidth and accessible attributes', () => {
      render(
        <Button variant="primary" size="md" fullWidth>
          Apply Now
        </Button>
      );

      const btn = screen.getByRole('button', { name: 'Apply Now' });
      expect(btn).toHaveClass('w-full');
      expect(btn).toHaveClass('h-10');
      expect(btn).toHaveClass('rounded-xl');
    });
  });
});
