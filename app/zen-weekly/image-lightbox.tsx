"use client";

import { useEffect, useId, useRef, useState } from "react";

import styles from "./zen-weekly.module.css";

type ImageLightboxProps = {
  src: string;
  alt: string;
  caption?: string | null;
  priority?: boolean;
  className?: string;
};

export function ImageLightbox({
  src,
  alt,
  caption,
  priority = false,
  className,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const captionId = useId();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function openViewer() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    setZoom(1);
  }

  function closeViewer() {
    dialogRef.current?.close();
  }

  function handleClose() {
    document.body.style.overflow = previousOverflow.current;
    triggerRef.current?.focus();
    setZoom(1);
  }

  const viewerLabel = caption || alt || "Expanded ZEN Weekly image";

  return (
    <>
      <button
        ref={triggerRef}
        className={`${styles.imageExpandTrigger} ${className ?? ""}`}
        type="button"
        onClick={openViewer}
        aria-label={`Expand image: ${viewerLabel}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        <span className={styles.imageExpandHint} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
          </svg>
          View image
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label={viewerLabel}
        aria-describedby={caption ? captionId : undefined}
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeViewer();
        }}
      >
        <div className={styles.lightboxFrame}>
          <button className={styles.lightboxClose} type="button" onClick={closeViewer} aria-label="Close image viewer">
            <span aria-hidden="true">×</span>
          </button>
          <div className={styles.lightboxZoom} aria-label="Image zoom controls">
            <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.5))} disabled={zoom <= 1} aria-label="Zoom out">−</button>
            <output aria-live="polite">{Math.round(zoom * 100)}%</output>
            <button type="button" onClick={() => setZoom((value) => Math.min(3.5, value + 0.5))} disabled={zoom >= 3.5} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => setZoom(1)} disabled={zoom === 1}>Reset</button>
          </div>
          <div className={styles.lightboxStage} tabIndex={0} aria-label="Zoomable image area">
          {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.lightboxImage} src={src} alt={alt} style={{ width: `${zoom * 100}%` }} />
          </div>
          {caption ? <p className={styles.lightboxCaption} id={captionId}>{caption}</p> : null}
        </div>
      </dialog>
    </>
  );
}
