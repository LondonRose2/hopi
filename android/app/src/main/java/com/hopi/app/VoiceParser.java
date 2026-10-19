package com.hopi.app;

import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VoiceParser {

    public static class ParsedVoiceReminder {
        public String rawTranscript;
        public String itemType; // "task" or "routine"
        public String title;
        public String emoji;
        public String time; // e.g. "08:00 PM"
        public String date; // "YYYY-MM-DD"
        public String recurring; // "none", "daily", "weekdays", "weekly", "hourly"
        public int repeatIntervalHours = 0;
        public boolean isComplete;
        public String missingField; // "time", "title", or null
        public String clarificationPrompt;
    }

    private static final String[] ROUTINE_KEYWORDS = {
        "every", "each", "daily", "routine", "weekdays", "weekly", "repeat", "regularly",
        "every day", "every month", "every week", "every morning", "every evening", "every night",
        "every monday", "every tuesday", "every wednesday", "every thursday", "every friday", "every saturday", "every sunday"
    };

    public static boolean isWaterIntakePhrase(String transcript) {
        if (transcript == null) return false;
        String lower = transcript.toLowerCase().trim();
        return lower.matches(".*\\b(drank|drunk|drink|had|finished|logged)\\b.*\\b(water|hydration|glass of water|bottle)\\b.*")
                || lower.matches(".*\\b(water|hydration)\\b.*\\b(done|checked|finished|logged)\\b.*")
                || lower.equals("i drank water")
                || lower.equals("drank water")
                || lower.equals("had water")
                || lower.equals("water intake")
                || lower.equals("log water")
                || lower.equals("drink water");
    }

    public static ParsedVoiceReminder parse(String transcript) {
        if (transcript == null) transcript = "";
        String trimmed = transcript.trim();
        ParsedVoiceReminder r = new ParsedVoiceReminder();
        r.rawTranscript = trimmed;

        String lower = trimmed.toLowerCase();
        boolean isRoutine = false;
        Pattern hourlyPattern = Pattern.compile("\\bevery\\s+(\\d+)?\\s*(?:hour|hours|hr|hrs)\\b", Pattern.CASE_INSENSITIVE);
        Matcher hourlyMatcher = hourlyPattern.matcher(lower);
        if (hourlyMatcher.find()) {
            isRoutine = true;
            r.itemType = "routine";
            r.recurring = "hourly";
            String hGroup = hourlyMatcher.group(1);
            r.repeatIntervalHours = (hGroup != null && !hGroup.isEmpty()) ? Integer.parseInt(hGroup) : 1;
        } else {
            for (String kw : ROUTINE_KEYWORDS) {
                if (lower.contains(kw)) {
                    isRoutine = true;
                    break;
                }
            }

            if (isRoutine) {
                r.itemType = "routine";
                if (lower.contains("weekday")) {
                    r.recurring = "weekdays";
                } else if (lower.contains("weekly") || lower.contains("every week") || lower.matches(".*every (monday|tuesday|wednesday|thursday|friday|saturday|sunday).*")) {
                    r.recurring = "weekly";
                } else {
                    r.recurring = "daily";
                }
            } else {
                r.itemType = "task";
                r.recurring = "none";
            }
        }

        r.time = parseTime(lower);
        if ("hourly".equals(r.recurring) && (r.time == null || r.time.isEmpty())) {
            Calendar c = Calendar.getInstance();
            c.add(Calendar.HOUR_OF_DAY, 1);
            int h = c.get(Calendar.HOUR_OF_DAY);
            String meridiem = h >= 12 ? "PM" : "AM";
            int dispH = h % 12 == 0 ? 12 : h % 12;
            r.time = String.format(java.util.Locale.US, "%02d:00 %s", dispH, meridiem);
        }
        r.date = parseDate(lower);
        r.title = cleanTitle(trimmed);
        r.emoji = inferEmoji(r.title);

        boolean missingTime = (r.time == null || r.time.isEmpty());
        boolean missingTitle = (r.title == null || r.title.isEmpty() || r.title.equalsIgnoreCase("Gentle Reminder"));

        if (missingTime) {
            r.missingField = "time";
            r.clarificationPrompt = "What time should I remind you about " + r.title + "?";
            r.isComplete = false;
        } else if (missingTitle) {
            r.missingField = "title";
            r.clarificationPrompt = "What would you like me to remind you to do?";
            r.isComplete = false;
        } else {
            r.isComplete = true;
        }

        return r;
    }

    public static ParsedVoiceReminder fillClarification(ParsedVoiceReminder pending, String answer) {
        if (pending == null) return parse(answer);
        String lower = (answer != null ? answer.toLowerCase().trim() : "");

        if ("time".equals(pending.missingField)) {
            String time = parseTime(lower);
            if (time != null) {
                pending.time = time;
                pending.missingField = null;
                pending.clarificationPrompt = null;
                pending.isComplete = true;
            }
            String date = parseDate(lower);
            if (date != null) pending.date = date;
        } else if ("title".equals(pending.missingField)) {
            String title = cleanTitle(answer);
            if (!title.isEmpty() && !title.equalsIgnoreCase("Gentle Reminder")) {
                pending.title = title;
                pending.emoji = inferEmoji(title);
                pending.missingField = null;
                pending.clarificationPrompt = null;
                pending.isComplete = true;
            }
        }
        return pending;
    }

    public static String parseTime(String lower) {
        Pattern pattern = Pattern.compile("(?:at\\s+)?(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm|o'clock)?\\b", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(lower);

        if (matcher.find()) {
            int hour = Integer.parseInt(matcher.group(1));
            String minute = matcher.group(2) != null ? matcher.group(2) : "00";
            String meridiem = matcher.group(3) != null ? matcher.group(3).toUpperCase() : "";

            if (hour >= 1 && hour <= 24) {
                if (meridiem.equals("O'CLOCK") || meridiem.isEmpty()) {
                    if (lower.contains("tonight") || lower.contains("evening") || lower.contains("afternoon") || (hour >= 1 && hour <= 7)) {
                        meridiem = "PM";
                    } else {
                        meridiem = "AM";
                    }
                }
                if (hour > 12) {
                    hour -= 12;
                    meridiem = "PM";
                }
                return String.format("%02d:%s %s", hour, minute, meridiem);
            }
        }

        if (lower.contains("noon")) return "12:00 PM";
        if (lower.contains("midnight")) return "12:00 AM";
        if (lower.contains("morning")) return "09:00 AM";
        if (lower.contains("afternoon")) return "02:00 PM";
        if (lower.contains("evening")) return "07:00 PM";
        if (lower.contains("night") || lower.contains("tonight")) return "08:30 PM";

        return null;
    }

    public static String parseDate(String lower) {
        Calendar cal = Calendar.getInstance();

        if (lower.contains("tomorrow")) {
            cal.add(Calendar.DAY_OF_YEAR, 1);
            return String.format("%04d-%02d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
        }

        if (lower.contains("today") || lower.contains("tonight")) {
            return String.format("%04d-%02d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
        }

        String[] days = {"sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"};
        for (int i = 0; i < days.length; i++) {
            if (lower.contains(days[i])) {
                int currentDay = cal.get(Calendar.DAY_OF_WEEK) - 1;
                int diff = i - currentDay;
                if (diff <= 0 || lower.contains("next " + days[i])) diff += 7;
                cal.add(Calendar.DAY_OF_YEAR, diff);
                return String.format("%04d-%02d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
            }
        }

        return String.format("%04d-%02d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
    }

    public static String cleanTitle(String transcript) {
        String cleaned = transcript
                .replaceAll("(?i)^(?:remind me to|remind me|set a reminder to|set a reminder for|don't forget to|schedule a routine to|add a task to|create a task to|add routine to|remember to)\\s+", "")
                .replaceAll("(?i)\\b(?:every month|every day|every week|every morning|every evening|daily|weekly|weekdays)\\b", "")
                .replaceAll("(?i)\\b(?:every \\d+\\s*(?:hours|hour|hrs|hr)|every hour)\\b", "")
                .replaceAll("(?i)\\b(?:on the (?:first|second|third|fourth|last)|rotary)\\b", "")
                .replaceAll("(?i)\\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\\b", "")
                .replaceAll("(?i)\\b(?:tomorrow|today|tonight|next week|at \\d{1,2}(?::\\d{2})?\\s*(?:am|pm|o'clock)?)\\b", "")
                .replaceAll("(?i)\\b(?:in the morning|in the afternoon|in the evening|at noon|at midnight)\\b", "")
                .replaceAll("\\s+", " ")
                .trim();

        cleaned = cleaned.replaceAll("(?i)^(?:to|for|on)\\s+", "").trim();

        if (cleaned.isEmpty()) return "Gentle Reminder";
        return Character.toUpperCase(cleaned.charAt(0)) + cleaned.substring(1);
    }

    public static String inferEmoji(String title) {
        String t = (title != null ? title.toLowerCase() : "");
        if (t.matches(".*(water|hydrate|hydration|drink).*")) return "💧";
        if (t.matches(".*(pill|medicine|vitamin|supplement).*")) return "💊";
        if (t.matches(".*(pray|prayer|verse|bible|devotion|meditat).*")) return "🙏";
        if (t.matches(".*(read|book|study|chapter).*")) return "📚";
        if (t.matches(".*(call|phone|ring).*")) return "📞";
        if (t.matches(".*(package|mail|letter|delivery|amazon|pickup|pick up).*")) return "📦";
        if (t.matches(".*(clean|laundry|tidy|sweep|wash|dishes).*")) return "🧹";
        if (t.matches(".*(walk|run|exercise|workout|gym|stretch).*")) return "🏃";
        if (t.matches(".*(sleep|bed|rest|nap).*")) return "🛌";
        if (t.matches(".*(grocery|store|shopping|buy|market).*")) return "🛒";
        if (t.matches(".*(bill|receipt|pay|tax|bank).*")) return "📝";
        return "⏰";
    }
}
