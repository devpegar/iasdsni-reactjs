import { useState } from "react";
import { normalizeContentHtml, sanitizeHtml } from "../../../utils/sanitizeHtml";

export default function BeliefAccordion({ items = [] }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="belief-accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `belief-panel-${item.id}`;
        const buttonId = `belief-trigger-${item.id}`;
        const contentHtml = sanitizeHtml(normalizeContentHtml(item.content));

        return (
          <article className="belief-accordion__item" key={item.id}>
            <h2 className="belief-accordion__heading">
              <button
                id={buttonId}
                type="button"
                className="belief-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.title}</span>
                <span className="belief-accordion__icon" aria-hidden="true" />
              </button>
            </h2>

            <div
              id={panelId}
              className="belief-accordion__panel"
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
            >
              <div className="belief-accordion__content">
                <div
                  className="belief-accordion__rich-content"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
                {item.bible_references && (
                  <p className="belief-accordion__references">
                    <strong>Referencias bíblicas:</strong> {item.bible_references}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
