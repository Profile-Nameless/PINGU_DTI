import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  shouldAnimate = true,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  shouldAnimate?: boolean;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!shouldAnimate) {
      setCurrentText(words.map(word => word.text).join(" "));
      setShowCursor(false);
      return;
    }

    const currentWord = words[currentWordIndex];
    const isLastWord = currentWordIndex === words.length - 1;

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        if (isLastWord) {
          setShowCursor(false);
        } else {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setCurrentText("");
          setIsDeleting(false);
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText === currentWord.text) {
        setIsPaused(true);
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.text.slice(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, isDeleting, currentWordIndex, words, isPaused, shouldAnimate]);

  // Calculate total animation duration
  const totalDuration = words.length * 0.2 + 0.5; // 0.2s per word + 0.5s for initial animation

  // Check if animation has already played in this session
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const hasPlayed = localStorage.getItem('typewriterAnimated');
      if (hasPlayed === 'true') {
        setShowCursor(false);
      } else {
        // Mark as animated after the animation completes
        const timer = setTimeout(() => {
          localStorage.setItem('typewriterAnimated', 'true');
          setShowCursor(false);
        }, totalDuration * 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [totalDuration]);

  // If animation has already played, render the text without animation
  if (showCursor) {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        <div className="inline-block">
          {words.map((word, idx) => (
            <div key={word.text} className="inline-block">
              <span className={cn("", word.className)}>
                {word.text}
              </span>
              {idx < words.length - 1 ? <span className="mx-1">&nbsp;</span> : ""}
            </div>
          ))}
          <span className="text-gray-200">.</span>
        </div>
      </div>
    );
  }

  // Otherwise, render with animation
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {words.map((word, idx) => {
            return (
              <div key={word.text} className="inline-block">
                <motion.span
                  className={cn("", word.className)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.2,
                  }}
                >
                  {word.text}
                </motion.span>
                {idx < words.length - 1 ? <span className="mx-1">&nbsp;</span> : ""}
              </div>
            );
          })}
          <motion.span
            className="text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: words.length * 0.2,
            }}
            onAnimationComplete={() => setShowCursor(false)}
          >
            .
          </motion.span>
        </motion.div>
      </AnimatePresence>
      {showCursor && (
        <motion.span
          className={cn(
            "inline-block h-4 w-[1px] bg-white",
            cursorClassName
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
    </div>
  );
} 