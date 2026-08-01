type TreasuryVariant = "archive" | "charter" | "issuance" | "legal";

export function TreasuryBackdrop({
  variant = "archive",
}: {
  variant?: TreasuryVariant;
}) {
  return (
    <div
      className={`treasury-backdrop treasury-backdrop--${variant}`}
      aria-hidden="true"
    >
      <div className="treasury-backdrop__wavebank">
        {Array.from({ length: 14 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="treasury-backdrop__rosette treasury-backdrop__rosette--one">
        <i />
        <i />
        <i />
      </div>
      <div className="treasury-backdrop__rosette treasury-backdrop__rosette--two">
        <i />
        <i />
        <i />
      </div>
      <div className="treasury-backdrop__thread">
        ZEN AI CO. · HUMAN AGENCY · VISIBLE PROOF · SERIES MMXXVI
      </div>
      <span className="treasury-backdrop__register treasury-backdrop__register--one">
        +
      </span>
      <span className="treasury-backdrop__register treasury-backdrop__register--two">
        +
      </span>
    </div>
  );
}

export function TreasuryPageFrame({
  chapter,
  serial,
}: {
  chapter: string;
  serial: string;
}) {
  return (
    <div className="treasury-page-frame" aria-hidden="true">
      <span className="treasury-page-frame__chapter">{chapter}</span>
      <span className="treasury-page-frame__serial">{serial}</span>
      <span className="treasury-page-frame__corner treasury-page-frame__corner--tl" />
      <span className="treasury-page-frame__corner treasury-page-frame__corner--tr" />
      <span className="treasury-page-frame__corner treasury-page-frame__corner--bl" />
      <span className="treasury-page-frame__corner treasury-page-frame__corner--br" />
    </div>
  );
}
