package cn.domekisuzi.utils;

 
 
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    // 将字符串解析为 LocalDateTime（前端发送的格式）
    public static LocalDateTime parse(String input) {
        return LocalDateTime.parse(input, formatter);
    }

     // 前端传本地时间字符串，转为 UTC 存储
    public static LocalDateTime parseToUTC(String input, ZoneId clientZone) {
        LocalDateTime local = LocalDateTime.parse(input, formatter);
        ZonedDateTime zoned = local.atZone(clientZone);
        ZonedDateTime utcZoned = zoned.withZoneSameInstant(ZoneId.of("UTC"));
        return utcZoned.toLocalDateTime();
    }

     // 数据库取出 UTC 时间，转为本地时间字符串返回前端
    public static String formatFromUTC(LocalDateTime utcTime, ZoneId clientZone) {
        ZonedDateTime utcZoned = utcTime.atZone(ZoneId.of("UTC"));
        ZonedDateTime localZoned = utcZoned.withZoneSameInstant(clientZone);
        return localZoned.format(formatter);
    }

    // 将 LocalDateTime 转为字符串（用于返回给前端）
    public static String format(LocalDateTime time) {
        return time.format(formatter);
    }

    // 获取当前时间（用于 createdAt / updatedAt）
    public static LocalDateTime now() {
        return LocalDateTime.now();
    }
}
