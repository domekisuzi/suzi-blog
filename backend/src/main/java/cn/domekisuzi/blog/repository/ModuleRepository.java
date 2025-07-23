package cn.domekisuzi.blog.repository;

 
import cn.domekisuzi.blog.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ModuleRepository extends JpaRepository<Module, String> {
    Optional<Module> findByName(String name);
}
