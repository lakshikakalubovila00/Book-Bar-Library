package lk.bookbarlibrary.grn.dao;

import lk.bookbarlibrary.grn.entity.GRN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GRNDao extends JpaRepository<GRN,Integer> {

    @Query(value = "SELECT coalesce(concat('GRN',year(current_date()),lpad(substring(max(grn.grnno),8)+1,5,'0')), concat('GRN',year(current_date()),'00001')) From GRN grn where year(current_date())=year(grn.addeddatetime)", nativeQuery = true)
    String getNextGRNNo();

    @Query(value = "select grn from GRN grn where  grn.supplier_id.id=?1 and grn.grnstatus_id.id in(1,2)")
    List<GRN> getGRNListBySupplier(Integer supplierid);
}
