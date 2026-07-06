'use client'

/**
 * Long-take scrubber: coalesces scroll updates so the browser never receives
 * a second seek while the previous frame is still decoding.
 */
export function createVideoScrollScrubber(video: HTMLVideoElement) {
  let targetProgress = 0
  let rafId = 0
  let disposed = false
  let playRequested = false

  const duration = () => Number.isFinite(video.duration) ? video.duration : 0

  const schedule = () => {
    if (disposed || rafId) return
    rafId = requestAnimationFrame(update)
  }

  const requestPlay = () => {
    if (!video.paused || playRequested) return
    playRequested = true
    video.play()
      .catch(() => {
        if (!video.seeking) video.currentTime = targetProgress * duration()
      })
      .finally(() => {
        playRequested = false
        schedule()
      })
  }

  const update = () => {
    rafId = 0
    if (disposed) return

    const total = duration()
    if (total <= 0) return

    const endFrame = Math.max(0, total - 0.01)
    const target = Math.min(endFrame, Math.max(0, targetProgress * total))
    const delta = target - video.currentTime

    if (delta > 0.025) {
      // Tracking shot: decode sequentially forward instead of seeking every frame.
      if (delta > 0.7 && !video.seeking) {
        video.pause()
        video.currentTime = Math.max(video.currentTime, target - 0.24)
        return
      }

      video.playbackRate = Math.min(4, Math.max(0.35, delta * 5))
      requestPlay()
      schedule()
      return
    }

    if (delta < -0.025) {
      // Reverse travel is coalesced into one latest seek.
      video.pause()
      if (!video.seeking) video.currentTime = target
      return
    }

    video.pause()
  }

  const onSeeked = () => schedule()
  const onReady = () => schedule()
  video.addEventListener('seeked', onSeeked)
  video.addEventListener('loadedmetadata', onReady)

  return {
    setProgress(progress: number) {
      targetProgress = Math.min(1, Math.max(0, progress))
      schedule()
    },
    destroy() {
      disposed = true
      video.pause()
      if (rafId) cancelAnimationFrame(rafId)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onReady)
    },
  }
}
