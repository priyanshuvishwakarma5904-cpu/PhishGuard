export type ThreatLevel = "Safe" | "Suspicious" | "Phishing";

export interface DetectionResult {
  status: ThreatLevel;
  reasons: string[];
  score: number; // 0-100, higher = more dangerous
  details: {
    hasHttps: boolean;
    urlLength: number;
    suspiciousKeywords: string[];
    hasIpAddress: boolean;
    dotCount: number;
    hasAtSymbol: boolean;
    hasRedirect: boolean;
    hasShortenedUrl: boolean;
  };
}

const SUSPICIOUS_KEYWORDS = [
  "login", "verify", "bank", "secure", "update", "account",
  "confirm", "password", "signin", "security", "suspend",
  "expire", "urgent", "click", "validate", "authenticate",
  "wallet", "paypal", "apple", "microsoft", "netflix",
];

const URL_SHORTENERS = [
  "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
  "is.gd", "buff.ly", "rebrand.ly", "cutt.ly",
];

const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

export function analyzeUrl(rawUrl: string): DetectionResult {
  const reasons: string[] = [];
  let score = 0;

  // Normalize
  const url = rawUrl.trim().toLowerCase();

  // Validate URL format
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith("http") ? url : `http://${url}`);
  } catch {
    return {
      status: "Phishing",
      reasons: ["Invalid URL format — could not parse"],
      score: 100,
      details: {
        hasHttps: false, urlLength: url.length, suspiciousKeywords: [],
        hasIpAddress: false, dotCount: 0, hasAtSymbol: false,
        hasRedirect: false, hasShortenedUrl: false,
      },
    };
  }

  // 1. HTTPS check
  const hasHttps = parsed.protocol === "https:";
  if (!hasHttps) {
    reasons.push("No HTTPS — connection is not encrypted");
    score += 20;
  }

  // 2. URL length
  const urlLength = url.length;
  if (urlLength > 100) {
    reasons.push(`Excessively long URL (${urlLength} chars) — common in phishing`);
    score += 20;
  } else if (urlLength > 75) {
    reasons.push(`Long URL (${urlLength} chars) — somewhat suspicious`);
    score += 10;
  }

  // 3. Suspicious keywords
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) =>
    parsed.hostname.includes(kw) || parsed.pathname.includes(kw)
  );
  if (foundKeywords.length > 0) {
    reasons.push(`Suspicious keywords detected: ${foundKeywords.join(", ")}`);
    score += Math.min(foundKeywords.length * 10, 30);
  }

  // 4. IP address instead of domain
  const hasIpAddress = IP_REGEX.test(parsed.hostname);
  if (hasIpAddress) {
    reasons.push("URL uses IP address instead of domain name");
    score += 25;
  }

  // 5. Dot count in hostname
  const dotCount = (parsed.hostname.match(/\./g) || []).length;
  if (dotCount > 4) {
    reasons.push(`Excessive subdomains (${dotCount} dots) — obfuscation technique`);
    score += 20;
  } else if (dotCount > 3) {
    reasons.push(`Many subdomains (${dotCount} dots) — slightly suspicious`);
    score += 10;
  }

  // 6. @ symbol (credential phishing)
  const hasAtSymbol = url.includes("@");
  if (hasAtSymbol) {
    reasons.push("Contains '@' symbol — may redirect to a different site");
    score += 20;
  }

  // 7. Redirect patterns
  const hasRedirect = url.includes("//") && url.indexOf("//", url.indexOf("//") + 2) > 0;
  if (hasRedirect) {
    reasons.push("Contains redirect pattern (double //)");
    score += 15;
  }

  // 8. URL shortener
  const hasShortenedUrl = URL_SHORTENERS.some((s) => parsed.hostname.includes(s));
  if (hasShortenedUrl) {
    reasons.push("Uses URL shortener — destination is hidden");
    score += 15;
  }

  // Clamp score
  score = Math.min(score, 100);

  // Determine status
  let status: ThreatLevel;
  if (score >= 50) {
    status = "Phishing";
  } else if (score >= 20) {
    status = "Suspicious";
  } else {
    status = "Safe";
  }

  if (status === "Safe") {
    reasons.push("No suspicious indicators detected");
  }

  return {
    status,
    reasons,
    score,
    details: {
      hasHttps, urlLength, suspiciousKeywords: foundKeywords,
      hasIpAddress, dotCount, hasAtSymbol, hasRedirect, hasShortenedUrl,
    },
  };
}

export const SAMPLE_URLS = {
  safe: [
    "https://www.google.com",
    "https://github.com",
    "https://stackoverflow.com",
  ],
  suspicious: [
    "http://example-login.com/verify",
    "http://my.secure.bank.update.com",
  ],
  phishing: [
    "http://192.168.1.1/login/verify/account",
    "http://secure-bank-login.verify.update.account.com/authenticate?password=reset",
  ],
};
