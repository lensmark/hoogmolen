/**
 * AddressAutocomplete — herbruikbaar adresblok met Photon (OpenStreetMap)
 * autocomplete op het straat-veld. Bij selectie worden straat, huisnummer,
 * postcode én gemeente automatisch ingevuld. BBox beperkt tot BE/NL.
 *
 * Gebruikt door alle publieke formulieren (Contact, Vergaderoffert​e,
 * Groepsverblijf-aanvraag) zodat het gedrag identiek blijft.
 */
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface PhotonFeature {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
}

export interface AddressValue {
  street: string;
  housenumber: string;
  postcode: string;
  city: string;
}

interface AddressAutocompleteProps {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  legend?: string;
  optional?: boolean;
  className?: string;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  legend = "Adres",
  optional = true,
  className,
}: AddressAutocompleteProps) => {
  const debounceRef = useRef<number | null>(null);
  const skipNextSearchRef = useRef(false);
  const [suggesties, setSuggesties] = useState<PhotonFeature[]>([]);
  const [showSug, setShowSug] = useState(false);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const q = value.street.trim();
    if (q.length < 3) {
      setSuggesties([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=default&bbox=2.5,49.4,7.3,53.6`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggesties(Array.isArray(data?.features) ? data.features : []);
      } catch {
        setSuggesties([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value.street]);

  const pickSuggestion = (f: PhotonFeature) => {
    const p = f.properties;
    skipNextSearchRef.current = true;
    onChange({
      street: p.street || p.name || value.street,
      housenumber: p.housenumber || value.housenumber,
      postcode: p.postcode || value.postcode,
      city: p.city || value.city,
    });
    setShowSug(false);
    setSuggesties([]);
  };

  return (
    <fieldset className={`space-y-3 border-t border-border pt-4 ${className ?? ""}`}>
      <legend className="text-sm font-medium text-primary-deep px-1 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
        {legend}{" "}
        {optional && (
          <span className="text-muted-foreground text-xs font-normal">
            (optioneel — typ uw straat om te zoeken)
          </span>
        )}
      </legend>

      <div className="grid sm:grid-cols-[1fr_120px] gap-4">
        <div className="space-y-1.5 relative">
          <Label htmlFor="street">Straat</Label>
          <Input
            id="street"
            name="street"
            value={value.street}
            onChange={(e) => {
              onChange({ ...value, street: e.target.value });
              setShowSug(true);
            }}
            onFocus={() => setShowSug(true)}
            onBlur={() => setTimeout(() => setShowSug(false), 200)}
            maxLength={160}
            autoComplete="off"
            placeholder="Begin te typen..."
          />
          {showSug && suggesties.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggesties.map((f, i) => {
                const p = f.properties;
                const line1 = [p.street || p.name, p.housenumber].filter(Boolean).join(" ");
                const line2 = [p.postcode, p.city, p.country].filter(Boolean).join(" ");
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickSuggestion(f)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary text-primary-deep"
                    >
                      <div className="font-medium">{line1}</div>
                      <div className="text-xs text-muted-foreground">{line2}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="housenumber">Nummer</Label>
          <Input
            id="housenumber"
            name="housenumber"
            value={value.housenumber}
            onChange={(e) => onChange({ ...value, housenumber: e.target.value })}
            maxLength={20}
            autoComplete="address-line2"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-[140px_1fr] gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            value={value.postcode}
            onChange={(e) => onChange({ ...value, postcode: e.target.value })}
            maxLength={20}
            autoComplete="postal-code"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">Gemeente</Label>
          <Input
            id="city"
            name="city"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            maxLength={120}
            autoComplete="address-level2"
          />
        </div>
      </div>
    </fieldset>
  );
};

export const formatAddress = (a: AddressValue): string => {
  const parts = [
    [a.street, a.housenumber].filter(Boolean).join(" "),
    [a.postcode, a.city].filter(Boolean).join(" "),
  ].filter(Boolean);
  return parts.join(", ");
};

export const emptyAddress = (): AddressValue => ({
  street: "",
  housenumber: "",
  postcode: "",
  city: "",
});

export default AddressAutocomplete;
