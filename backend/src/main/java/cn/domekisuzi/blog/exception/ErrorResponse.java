package cn.domekisuzi.blog.exception;

 
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private String errorType;
    private String message;
    private String path;
}
