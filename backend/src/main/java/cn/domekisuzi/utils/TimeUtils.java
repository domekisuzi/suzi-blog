package cn.domekisuzi.utils;

 
 
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    // 将字符串解析为 LocalDateTime（前端发送的格式）
    public static LocalDateTime parse(String input) {
        return LocalDateTime.parse(input, formatter);
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
