package cn.domekisuzi.blog.repository.projection;

import java.math.BigInteger;

public interface ModuleDetailProjection {
    String getId();
    String getName();
    BigInteger getTaskNumber();
    BigInteger getSubtaskNumber();
    BigInteger getCompletedTaskNumber();
    BigInteger getCompletedSubtaskNumber();
    String getIconSVG();
}