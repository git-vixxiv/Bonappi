export default function ScreenWrapper({
  children,
  padding = true,
  scrollable = true,
  className = '',
}) {
  return (
    <div
      className={`
        ${padding ? 'px-4' : ''}
        ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
