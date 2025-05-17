import { motion, AnimatePresence } from 'framer-motion';

interface TagPopupProps {
  tags: string[];
  isVisible: boolean;
  onClose: () => void;
}

export const TagPopup = ({ tags, isVisible, onClose }: TagPopupProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="card py-3 px-4 shadow-xl flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-accent-secondary/10 text-accent-secondary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-bg-secondary rounded-full transition-colors"
              aria-label="Close popup"
            >
              <svg
                className="w-5 h-5 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 