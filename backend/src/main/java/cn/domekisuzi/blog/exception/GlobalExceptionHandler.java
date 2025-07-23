package cn.domekisuzi.blog.exception;

 

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {
private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 捕获所有未处理的异常
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex, WebRequest request) {
        log.error("🔥 错误发生于 [" + request.getDescription(false) + "]", ex); // 控制台日志定位
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                ex.getClass().getSimpleName(),
                ex.getMessage(),
                request.getDescription(false)
        );

        ex.printStackTrace(); // ✅ 后台输出完整堆栈（可选）

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 捕获你自定义的异常（例如 EntityNotFoundException）
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                "RuntimeException",
                ex.getMessage(),
                request.getDescription(false)
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
}
