package lk.bookbarlibrary;

import java.util.List;

import org.springframework.web.servlet.ModelAndView;

public interface CommonController<T> {
    
    public ModelAndView getUi();

    public List<T>findAllData();

    public String saveData(T t);

    public String updateData(T t);

    public String deleteData(T t);
}
