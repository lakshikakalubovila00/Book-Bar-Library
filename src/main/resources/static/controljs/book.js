
// tab panes

const tabpaneForm = document.getElementById("bookTabPillForm");
const tabPaneTable = document.getElementById("bookTabPillTable");
const tabPillForm = document.getElementById("bookFormPill");
const tabPillTable = document.getElementById("bookTablePill");

// form elements

const selectResourceTypeElement= document.querySelector("#selectResourceType");
const selectLanguageElement= document.querySelector("#selectLanguage");
const selectDisplayCategoryElement= document.querySelector("#selectDisplayCategory");
const selectBookStatusElement= document.querySelector("#selectBookStatus");
const selectMagazineFrequency= document.querySelector("#selectMagazineFrequency");
const selectNewsPaperEdition = document.querySelector("#selectNewsPaperEdition");
const selectNewsPaperFrequency= document.querySelector("#selectNewsPaperFrequency");
const selectJournalFrequency =document.querySelector("#selectJournalFrequency");
const resourceType= document.getElementById("selectResourceType");
const titleElement= document.getElementById("textTitle");
const authorelement= document.getElementById("textAuthor");
const publicationDateElement =document.getElementById("datePublicationDate");
const ddcNoElement= document.getElementById("textDdcNo");
const calNoElement=document.getElementById("textCallNo");
const numberInitialpriceElement= document.getElementById("numberInitialprice")
const authorList= document.getElementById("authorList");
const publisherList= document.getElementById("publisherList")
const seriesList = document.getElementById("seriesList");

// table body
let tableBody = document.querySelector("#tableBodyBook");

// columns and rows to show or hide

const authorColumnElement= document.getElementById("authorColumn")
const publicationDateColumnElement= document.getElementById("publicationDateColumn")
const editonAndEditionYearRow= document.getElementById("editonAndEditionYearRow");
const seriesAndSeriesNoRow= document.getElementById("seriesAndSeriesNoRow");
const startedyearAndFrequencyRow= document.getElementById("startedyearAndFrequencyRow");
const magazineFrequencyColumn= document.getElementById("magazineFrequencyColumn");
const journalFrequencyColumn= document.getElementById("journalFrequencyColumn");
const volumeandIssueNoRow= document.getElementById("volumeandIssueNoRow");
const newsPaperEditionandDrequencyRow = document.getElementById("newsPaperEditionandDrequencyRow");
const isbnInputAreaElement= document.getElementById("isbnInputArea");
const issnInputAreaElement= document.getElementById("issnInputArea");
const ddcAndCallNoRow= document.getElementById("ddcAndCallNoRow");

// required star element show or hide

const starAuthorRequiredElement = document.getElementById("starAuthorRequired")
const starISBNRequiredElement = document.getElementById("starISBNRequired")
const starISSNRequiredElement = document.getElementById("starISSNRequired")


// print modal -- table rows

const authorRow= document.getElementById("authorRow")
const publicationDateRow= document.getElementById("publicationDateRow")
const editionRow= document.getElementById("editionRow")
const editionYearRow= document.getElementById("editionYearRow")
const startedYearRow= document.getElementById("startedYearRow")
const magazineFrequencyRow= document.getElementById("magazineFrequencyRow")
const journalFrequencyRow= document.getElementById("journalFrequencyRow")
const volumeRow= document.getElementById("volumeRow")
const issueNoRow= document.getElementById("issueNoRow")
const newspaperEditionRow= document.getElementById("newspaperEditionRow")
const newspaperFrequencyRow= document.getElementById("newspaperFrequencyRow")
const isbnRow= document.getElementById("isbnRow")
const issnRow= document.getElementById("issnRow")
const seriesRow= document.getElementById("seriesRow")
const seriesNoRow= document.getElementById("seriesNoRow")
const ddcRow= document.getElementById("ddcRow")
const callNoRow= document.getElementById("callNoRow")

const editionYearElement= document.getElementById("textEditionYear");
const startedYearElement= document.getElementById("textStartedYear");

// access browser on load event
window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();

  // get logged user privilege
  userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Book")
    // call refresh table function
    refreshBooktable();
    // call refresh form function
    refreshBookForm();
})

const validateEditionYear=()=>{
    const currentYear= new Date().getFullYear();
    const editionYear = parseInt(textEditionYear.value);

    const pattern = "^([0-9]{4})$";
    const regExpPattern = new RegExp(pattern);
    // not empty
    if (editionYear != "") {
        if(regExpPattern.test(editionYear)){
            if(editionYear<1800 || editionYear>currentYear){
                Swal.fire({
                    title: "Edition year must be between 1800 and " + currentYear,
                    icon: "warning",
                    confirmButtonColor: "#ff0000ff",
                    confirmButtonText: "OK",
                })
                editionYearElement.style.borderBottom="2px solid pink"
            }else{
                editionYearElement.style.borderBottom="2px solid lightgreen"
            }
        }else{
            editionYearElement.style.borderBottom="2px solid pink"
        }
    }
}

const validateJournalStartedYear=()=>{
    const currentYear= new Date().getFullYear();
    const startedYear = parseInt(textStartedYear.value);

    const pattern = "^([0-9]{4})$";
    const regExpPattern = new RegExp(pattern);
    // not empty
    if (startedYear != "") {
        if(regExpPattern.test(startedYear)){
            if(startedYear<1800 || startedYear>currentYear){
                Swal.fire({
                    title: "Started year must be between 1700 and " + currentYear,
                    icon: "warning",
                    confirmButtonColor: "#ff0000ff",
                    confirmButtonText: "OK",
                })
                startedYearElement.style.borderBottom="2px solid pink"
            }else{
                startedYearElement.style.borderBottom="2px solid lightgreen"
            }
        }else{
            startedYearElement.style.borderBottom="2px solid pink"
        }
    }
}

resourceType.addEventListener("change",()=>{
    const selectedData= JSON.parse(selectResourceType.value);
    if (selectedData.name==="Book"){

        // author requied for book
        authorelement.required=true;
        starAuthorRequiredElement.style.display="block";

        // isbn required for book
        isbnInputAreaElement.required=true;
        isbnInputAreaElement.style.display="block";
        starISBNRequiredElement.style.display="block";

        // issn hide
        issnInputAreaElement.required=false;
        issnInputAreaElement.style.display="none";
        starISSNRequiredElement.style.display="none";

        // started year and frequency row hide for book
        startedyearAndFrequencyRow.style.display="none";

        // volume and issue no row hide for book
        volumeandIssueNoRow.style.display="none";

        // show edition and edition year row for book
        editonAndEditionYearRow.style.display="flex";

        // show series and series no row for book
        seriesAndSeriesNoRow.style.display="flex";

        // show author column and hide publication date
        authorColumnElement.style.display="block";
        publicationDateColumnElement.style.display="none";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";

    }if(selectedData.name==="Reference Material"){

        // same as book -- only change is author not required

        // isbn required for Reference Material
        isbnInputAreaElement.required=true;
        isbnInputAreaElement.style.display="block";
        starISBNRequiredElement.style.display="block";

        // issn hide
        issnInputAreaElement.required=false;
        issnInputAreaElement.style.display="none";
        starISSNRequiredElement.style.display="none";

        // started year and frequency row hide for book
        startedyearAndFrequencyRow.style.display="none";

        // volume and issue no row hide for book
        volumeandIssueNoRow.style.display="none";

        // show edition and edition year row for book
        editonAndEditionYearRow.style.display="flex";

        // show series and series no row for book
        seriesAndSeriesNoRow.style.display="flex";

        // show author column and hide publication date
        authorColumnElement.style.display="block";
        publicationDateColumnElement.style.display="none";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";

    }
    if(selectedData.name==="Newspaper"){

        // isbn not required and hide
        isbnInputAreaElement.required=false;
        isbnInputAreaElement.style.display="none";
        starISBNRequiredElement.style.display="none";

        // issn show and required
        issnInputAreaElement.required=true;
        issnInputAreaElement.style.display="block";
        starISSNRequiredElement.style.display="block";

        //edition and edition year row hide
        editonAndEditionYearRow.style.display="none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display="none";

        //ddc and call no is not required
        ddcNoElement.required=false;
        calNoElement.required=false;
        ddcAndCallNoRow.style.display="none";

        // started year and frequency row hide
        startedyearAndFrequencyRow.style.display="none";

        // volume and issue no row hide
        volumeandIssueNoRow.style.display="none";

        // show newspaper edition and frequency row .. and both required for newspaper
        newsPaperEditionandDrequencyRow.style.display="flex";
        selectNewsPaperFrequency.required=true;
        selectNewsPaperEdition.required=true;

        // author not required and hide... show publication date required
        authorelement.required=false;
        authorColumnElement.style.display="none";
        publicationDateElement.required=true;
        publicationDateColumnElement.style.display="block";

        // hide ddc And CallNo Row


    }if(selectedData.name==="Magazine"){

        //author is not required and hide.. show publication date and required
        authorelement.required=false;
        authorColumnElement.style.display="none";
        publicationDateElement.required=true;
        publicationDateColumnElement.style.display="block";

        // isbn not required and hide
        isbnInputAreaElement.required=false;
        isbnInputAreaElement.style.display="none";
        starISBNRequiredElement.style.display="none";

        // issn sho and required
        issnInputAreaElement.required=true;
        issnInputAreaElement.style.display="block";
        starISSNRequiredElement.style.display="block";


        //edition and edition year row hide
        editonAndEditionYearRow.style.display="none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display="none";

        // started year and frequency row show
        startedyearAndFrequencyRow.style.display="flex";

        // journal frequency column hide
        journalFrequencyColumn.style.display="none";

        // magazine frequency column show and required
        magazineFrequencyColumn.style.display="block";
        selectMagazineFrequency.required=true;

        // show volume and issue no row
        volumeandIssueNoRow.style.display="flex";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";

    }
    if(selectedData.name==="Journal"){
        //author is not required and hide.. show publication date and required
        authorelement.required=false;
        authorColumnElement.style.display="none";
        publicationDateElement.required=true;
        publicationDateColumnElement.style.display="block";

        // isbn not required and hide
        isbnInputAreaElement.required=false;
        isbnInputAreaElement.style.display="none";
        starISBNRequiredElement.style.display="none";

        // issn sho and required
        issnInputAreaElement.required=true;
        issnInputAreaElement.style.display="block";
        starISSNRequiredElement.style.display="block";

        //edition and edition year row hide
        editonAndEditionYearRow.style.display="none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display="none";

        // started year and frequency row show
        startedyearAndFrequencyRow.style.display="flex";

        // journal frequency column show
        journalFrequencyColumn.style.display="block";

        // magazine frequency column hide
        magazineFrequencyColumn.style.display="none";

        // show volume and issue no row
        volumeandIssueNoRow.style.display="flex";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";
    }
})

const disableElement=()=>{
        document.getElementById("selectResourceType").disabled=true;
        document.getElementById("textTitle").disabled=true;
        document.getElementById("textAuthor").disabled=true;
        document.getElementById("selectLanguage").disabled=true;
        document.getElementById("textEdition").disabled=true;
        document.getElementById("textEditionYear").disabled=true;
        document.getElementById("textPublisher").disabled=true;
        document.getElementById("textIsbn").disabled=true;
        document.getElementById("textIssn").disabled=true;
        document.getElementById("textSeries").disabled=true;
        document.getElementById("numberSeriesNo").disabled=true;
        document.getElementById("textDdcNo").disabled=true;
        document.getElementById("textCallNo").disabled=true;
        document.getElementById("textPages").disabled=true;
        document.getElementById("textDescription").disabled=true;
        document.getElementById("selectDisplayCategory").disabled=true;
        document.getElementById("fileCoverImage").disabled=true;
        document.getElementById("selectBookStatus").disabled=true;
        document.getElementById("textNote").disabled=true;
        document.getElementById("datePublicationDate").disabled=true;
        document.getElementById("numberInitialprice").disabled=true;

        // magazine
        document.getElementById("textStartedYear").disabled=true;
        selectMagazineFrequency.disabled=true;
        document.getElementById("textVolume").disabled=true;
        document.getElementById("textIssueNo").disabled=true;

        // journal
        selectJournalFrequency.disabled=true;

        // newspaper
        selectNewsPaperEdition.disabled=true;
        selectNewsPaperFrequency.disabled=true;
}

const generateCallNo=()=>{
    const selectedData= JSON.parse(selectResourceType.value);
    if(selectedData.name==="Book"|| selectedData.name==="Magazine"||selectedData.name==="Journal"){
        let titleName=titleElement.value.substring(0,3).toUpperCase();
        let authorName= authorelement.value.trim().split(" ").pop();
        const authorCode=authorName.substring(0,3).toUpperCase();
        let ddcnoElement=ddcNoElement.value;
        book.callno= ddcnoElement +" "+authorCode+" "+ titleName;
        calNoElement.value= book.callno;
        calNoElement.style.borderBottom="2px solid lightgreen";
    }
    if (selectedData.name==="Reference Material"){
        let titleName=titleElement.value.substring(0,3).toUpperCase();
        let authorName= authorelement.value.trim().split(" ").pop();
        const authorCode=authorName.substring(0,3).toUpperCase();
        let ddcnoElement=ddcNoElement.value;
        book.callno= "REF "+ddcnoElement +" "+authorCode+" "+ titleName;
        calNoElement.value= book.callno;
        calNoElement.style.borderBottom="2px solid lightgreen";
    }
    if(selectedData.name==="Newspaper"){
        book.callno=null;
    }

}

// define refresh table function
const refreshBooktable = () => {
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableBook')) {
        $('#tableBook').DataTable().destroy();
    }
    //data array
    let books = ajaxGetrequest("/book/alldatabyorderdesc");

    // property array
    let displayProperty = [
        { propertyName: "coverimage", dataType: "image" },
        { propertyName: getResourceType, dataType: "function" },
        { propertyName: "title", dataType: "string" },
        { propertyName: "author", dataType: "string" },
        { propertyName: getLanguage, dataType: "function" },
        { propertyName: "publisher", dataType: "string" },
        { propertyName: getIsbnOrIssn, dataType: "function" },
        { propertyName: "seriestitle", dataType: "string" },
        { propertyName: getDisplayCategory, dataType: "function" },
        { propertyName: getBookStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableEight(
        tableBody,
        books,
        displayProperty,
        refillBookForm,
        "/resources/images/bookdefault.png"
    );

    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableBook").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// define function for get resource types
const getResourceType = (ob) => {
    return ob.resourcetype_id.name;
};

//define function for get languages
const getLanguage=(ob)=>{
    return ob.language_id.name;
}

//define function for get Display Category
const getDisplayCategory=(ob)=>{
    return ob.displaycategory_id.name;
}
const getBookStatus = (ob) => {
    if (ob.bookstatus_id.name == "Available") {
        return '<i class="fa-solid fa-store" style="color:#00c40bff;"></i>';
    }
    if (ob.bookstatus_id.name == "Not-Available") {
        return '<i class="fa-solid fa-store-slash" style="color:#ff8c00ff;"></i>';
    }
    if (ob.bookstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg" style="color: rgb(255, 0, 0);"></i>';
    }
}

// define function for get isbn or issn according to resource type
const getIsbnOrIssn=(ob)=>{
    const resourceType=ob.resourcetype_id.name;
        if (resourceType === "Book" || resourceType === "Reference Material") {
            //isbn - optional
           return ob.isbn;
        }else{
            return ob.issn;
        }
}

// define function for refill book form
const refillBookForm=(dataOb)=>{
    setInitial([
        selectResourceType,
        textTitle,
        selectLanguage,
        textAuthor,
        datePublicationDate,
        textEdition,
        textEditionYear,
        textStartedYear,
        selectMagazineFrequency,
        selectJournalFrequency,
        selectNewsPaperEdition,
        selectNewsPaperFrequency,
        textVolume,
        textIssueNo,
        textPublisher,
        textIsbn,
        textIssn,
        textSeries,
        numberSeriesNo,
        textDdcNo,
        textCallNo,
        textPages,
        textDescription,
        selectDisplayCategory,
        //cover image
        selectBookStatus,
        textNote
    ])

    console.log(dataOb);
    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    // direct assign - reference variable
    book = getHttpServiceRequest("book/byid/"+ dataOb.id);
    oldBook = getHttpServiceRequest("book/byid/"+ dataOb.id);


    const resourceType=dataOb.resourcetype_id.name;

    if (resourceType==="Book"){

        // author required for book
        authorelement.required=true;
        starAuthorRequiredElement.style.display="block";

        // isbn required for book
        isbnInputAreaElement.required=true;
        isbnInputAreaElement.style.display="block";
        starISBNRequiredElement.style.display="block";

        // issn hide
        issnInputAreaElement.required=false;
        issnInputAreaElement.style.display="none";
        starISSNRequiredElement.style.display="none";

        // started year and frequency row hide for book
        startedyearAndFrequencyRow.style.display="none";

        // volume and issue no row hide for book
        volumeandIssueNoRow.style.display="none";

        // show edition and edition year row for book
        editonAndEditionYearRow.style.display="flex";

        // show series and series no row for book
        seriesAndSeriesNoRow.style.display="flex";

        // show author column and hide publication date
        authorColumnElement.style.display="block";
        publicationDateColumnElement.style.display="none";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";

    }if(resourceType==="Reference Material"){

        // same as book -- only change is author not required

        // isbn required for Reference Material
        isbnInputAreaElement.required=true;
        isbnInputAreaElement.style.display="block";
        starISBNRequiredElement.style.display="block";

        // issn hide
        issnInputAreaElement.required=false;
        issnInputAreaElement.style.display="none";
        starISSNRequiredElement.style.display="none";

        // started year and frequency row hide for book
        startedyearAndFrequencyRow.style.display="none";

        // volume and issue no row hide for book
        volumeandIssueNoRow.style.display="none";

        // show edition and edition year row for book
        editonAndEditionYearRow.style.display="flex";

        // show series and series no row for book
        seriesAndSeriesNoRow.style.display="flex";

        // show author column and hide publication date
        authorColumnElement.style.display="block";
        publicationDateColumnElement.style.display="none";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";

    }
    if(resourceType==="Newspaper"){

        // isbn not required and hide
        isbnInputAreaElement.required=false;
        isbnInputAreaElement.style.display="none";
        starISBNRequiredElement.style.display="none";

        // issn sho and required
        issnInputAreaElement.required=true;
        issnInputAreaElement.style.display="block";
        starISSNRequiredElement.style.display="block";

        //edition and edition year row hide
        editonAndEditionYearRow.style.display="none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display="none";

        //ddc and call no is not required
        ddcNoElement.required=false;
        calNoElement.required=false;

        // hide ddc And CallNo Row
        ddcAndCallNoRow.style.display="none";

        // started year and frequency row hide
        startedyearAndFrequencyRow.style.display="none";

        // volume and issue no row hide
        volumeandIssueNoRow.style.display="none";

        // show newspaper edition and frequency row .. and both required for newspaper
        newsPaperEditionandDrequencyRow.style.display="flex";
        selectNewsPaperFrequency.required=true;
        selectNewsPaperEdition.required=true;

        // author not required and hide... show publication date required
        authorelement.required=false;
        authorColumnElement.style.display="none";
        publicationDateElement.required=true;
        publicationDateColumnElement.style.display="block";


    }if(resourceType==="Magazine"){

        //author is not required and hide.. show publication date and required
        authorelement.required=false;
        authorColumnElement.style.display="none";
        publicationDateElement.required=true;
        publicationDateColumnElement.style.display="block";

        // isbn not required and hide
        isbnInputAreaElement.required=false;
        isbnInputAreaElement.style.display="none";
        starISBNRequiredElement.style.display="none";

        // issn sho and required
        issnInputAreaElement.required=true;
        issnInputAreaElement.style.display="block";
        starISSNRequiredElement.style.display="block";


        //edition and edition year row hide
        editonAndEditionYearRow.style.display="none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display="none";

        // started year and frequency row show
        startedyearAndFrequencyRow.style.display="flex";

        // journal frequency column hide
        journalFrequencyColumn.style.display="none";

        // magazine frequency column show and required
        magazineFrequencyColumn.style.display="block";
        selectMagazineFrequency.required=true;

        // show volume and issue no row
        volumeandIssueNoRow.style.display="flex";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";

    }
    if(resourceType==="Journal"){
        //author is not required and hide.. show publication date and required
        authorelement.required=false;
        authorColumnElement.style.display="none";
        publicationDateElement.required=true;
        publicationDateColumnElement.style.display="block";

        // isbn not required and hide
        isbnInputAreaElement.required=false;
        isbnInputAreaElement.style.display="none";
        starISBNRequiredElement.style.display="none";

        // issn sho and required
        issnInputAreaElement.required=true;
        issnInputAreaElement.style.display="block";
        starISSNRequiredElement.style.display="block";

        //edition and edition year row hide
        editonAndEditionYearRow.style.display="none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display="none";

        // started year and frequency row show
        startedyearAndFrequencyRow.style.display="flex";

        // journal frequency column show
        journalFrequencyColumn.style.display="block";

        // magazine frequency column hide
        magazineFrequencyColumn.style.display="none";

        // show volume and issue no row
        volumeandIssueNoRow.style.display="flex";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display="none";

        // Show ddc And CallNo Row
        ddcNoElement.required=true;
        calNoElement.required=true;
        ddcAndCallNoRow.style.display="flex";
    }

    //resource type
    selectResourceType.value = JSON.stringify(book.resourcetype_id);

    // title
    textTitle.value = book.title;

    //author- optional
    if (book.author != undefined || book.author != null) {
        textAuthor.value = book.author;
    } else {
        textAuthor.value = "";
    }

    //language
    selectLanguage.value = JSON.stringify(book.language_id);

    //edition - optional
    if (book.edition != undefined || book.edition != null) {
        textEdition.value = book.edition;
    } else {
        textEdition.value = "";
    }

    //edition year- optional
    if (book.editionyear != undefined || book.editionyear != null) {
        textEditionYear.value = book.editionyear;
    } else {
        textEditionYear.value = "";
    }

    // publisher
    textPublisher.value=book.publisher;

    //isbn or issn
    if (resourceType === "Book" || resourceType === "Reference Material") {
        //isbn - optional
        if (book.isbn != undefined || book.isbn != null) {
            textIsbn.value = book.isbn;
        } else {
            textIsbn.value = "";
        }
    }else{
        // issn  - optional
        if (book.issn != undefined || book.issn != null) {
            textIssn.value = book.issn;
        } else {
            textIssn.value = "";
        }
    }

    //series- optional
    if (book.seriestitle != undefined || book.seriestitle != null) {
        textSeries.value = book.seriestitle;
    } else {
        textSeries.value = "";
    }

    // series no- optional
    if (book.seriesno != undefined || book.seriesno != null) {
        numberSeriesNo.value = book.seriesno;
    } else {
        numberSeriesNo.value = "";
    }

    // ddc no -- not required for newspaper
    if (book.ddcno != undefined || book.ddcno != null) {
        textDdcNo.value = book.ddcno;
    } else {
        textDdcNo.value = "";
    }

    // call no -- not required for newspaper
    if (book.callno != undefined || book.callno != null) {
        textCallNo.value = book.callno;
    } else {
        textCallNo.value = "";
    }

    //pages
    textPages.value=book.pages;

    // description- optional
    if (book.description != undefined || book.description != null) {
        textDescription.value = book.description;
    } else {
        textDescription.value = "";
    }

    //display category
    selectDisplayCategory.value = JSON.stringify(book.displaycategory_id);
    //pages
    numberInitialprice.value=book.initialprice;

    if(book.coverimage != null){
        imgCoverPhoto.src=atob(book.coverimage);
    }else{
        imgCoverPhoto.src="/resources/images/bookdefault.png";
    }

    //book status
    selectBookStatus.value = JSON.stringify(book.bookstatus_id);
    selectBookStatus.disabled=false;

    //note - optional
    if (book.note != undefined || book.note != null) {
        textNote.value = book.note;
    } else {
        textNote.value = "";
    }

    ///////Start -- MAGAZINE//////

    //started year - optional (magazine and journal)
    if (book.startedyear != undefined || book.startedyear != null) {
        textStartedYear.value = book.startedyear;
    } else {
        textStartedYear.value = "";
    }

    // magazine frequency -
    if (book.magazinefrequency_id!=undefined || book.magazinefrequency_id != null) {
        selectMagazineFrequency.value = JSON.stringify(book.magazinefrequency_id);
    } else {
        selectMagazineFrequency.value = "";
    }

    // volume - optional  (magazine and journal)
    if (book.volume != undefined || book.volume != null) {
        textVolume.value = book.volume;
    } else {
        textVolume.value = "";
    }

    // issue no - optional (magazine and journal)
    if (book.issueno != undefined || book.issueno != null) {
        textIssueNo.value = book.issueno;
    } else {
        textIssueNo.value = "";
    }

    ///////End -- MAGAZINE//////

    /////Start -- JOURNAL/////

    // journal frequency - optional
    if (book.journalfrequency_id !=undefined || book.journalfrequency_id != null) {
        selectJournalFrequency.value = JSON.stringify(book.journalfrequency_id);
    } else {
        selectJournalFrequency.value = "";
    }

    /////End -- JOURNAL/////

    ////Satrt -- NEWSPAPER////

    // newspaper edition
    if (book.newspaperedition_id != undefined || book.newspaperedition_id != null) {
        selectNewsPaperEdition.value = JSON.stringify(book.newspaperedition_id);
    } else {
        selectNewsPaperEdition.value = "";
    }

    //newspaper frequency
    if (book.newspaperfrequency_id != undefined || book.newspaperfrequency_id != null) {
        selectNewsPaperFrequency.value = JSON.stringify(book.newspaperfrequency_id);
    } else {
        selectNewsPaperFrequency.value = "";
    }

    ////End -- NEWSPAPER////

    // publication date for -- magazine , journal , newspaper
    if(book.publicationdate != undefined || book.publicationdate!= null){
        datePublicationDate.value= book.publicationdate;
    }else {
        datePublicationDate.value="";
    }

    if(!userPrivi.privi_update){
        buttonUpdate.classList.add("d-none");
    }else {
        buttonUpdate.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDelete.classList.add("d-none");
    }else {
        buttonDelete.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmit.classList.add("d-none");
    buttonPrint.classList.remove("d-none");

}

// define function for delete book record
const deleteBookRecord=(dataOb)=>{
    book = getHttpServiceRequest("book/byid/"+ dataOb.id);
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Book Record ?</p>
            <p>Resource Type : <strong>${book.resourcetype_id.name}</strong></p>
          <p>Title : <strong>${book.title || ''}</strong><br></p>
           <p>Author : <strong>${book.author || ''}</strong><br></p>
          <p>Publisher : <strong>${book.publisher || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel"

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/book/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Book Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshBooktable();
                //refresh form
                refreshBookForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Book record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// define function for book print
const printBookRecord = (dataOb) => {
    let bookModal_view = new bootstrap.Modal(
        document.getElementById("modalBookView"),
        {}
    );
    bookModal_view.show();
    book = getHttpServiceRequest("/book/byid/"+ dataOb.id)
    if(dataOb.coverimage){
        tdCoverImage.src= atob(dataOb.coverimage);
    }else{
        tdCoverImage.src="/resources/images/bookdefault.png";
    }

    const resourceType=dataOb.resourcetype_id.name;

    if (resourceType==="Book" || resourceType==="Reference Material"){

        // issn hide
        issnRow.style.display="none";

        // started year  hide
        startedYearRow.style.display="none";

        // magazine frequency hide
        magazineFrequencyRow.style.display="none";

        // journal frquency hide
        journalFrequencyRow.style.display="none";

        // volume hide
        volumeRow.style.display="none";

        // issue no hide
        issueNoRow.style.display="none";

        //  publication date hide
        publicationDateRow.style.display="none";

        // newspaper edition hide
        newspaperEditionRow.style.display="none";

        // newspaper frequency hide
        newspaperFrequencyRow.style.display="none";


        ////SHOW////
        // isbn show
        isbnRow.style.display="table-row";

        //edition show
        editionRow.style.display="table-row";

        // edition year  show
        editionYearRow.style.display="table-row";

        //series show
        seriesRow.style.display="table-row";

        // series no show
        seriesNoRow.style.display="table-row";

        //ddc show
        ddcRow.style.display="table-row";

        // call no show
        callNoRow.style.display="table-row";

        // author  show
        authorRow.style.display="table-row";

    }
    if(resourceType==="Newspaper"){

        // isbn hide
        isbnRow.style.display="none";

        //edition hide
        editionRow.style.display="none";

        // edition year  hide
        editionYearRow.style.display="none";

        //series hide
        seriesRow.style.display="none";

        // series no hide
        seriesNoRow.style.display="none";

        //ddc hide
        ddcRow.style.display="none";

        // call no hide
        callNoRow.style.display="none";

        // started year  hide
        startedYearRow.style.display="none";

        // magazine frequency hide
        magazineFrequencyRow.style.display="none";

        // journal frequency hide
        journalFrequencyRow.style.display="none";

        // volume hide
        volumeRow.style.display="none";

        // issue no hide
        issueNoRow.style.display="none";

        // author  hide
        authorRow.style.display="none";

        /////SHOW///

        // issn show
        issnRow.style.display="table-row";

        //  publication date show
        publicationDateRow.style.display="table-row";

        // newspaper edition show
        newspaperEditionRow.style.display="table-row";

        // newspaper frequency show
        newspaperFrequencyRow.style.display="table-row";

    }
    if(resourceType==="Magazine"){

        // author  hide
        authorRow.style.display="none";

        // isbn hide
        isbnRow.style.display="none";

        //edition hide
        editionRow.style.display="none";

        // edition year  hide
        editionYearRow.style.display="none";

        //series hide
        seriesRow.style.display="none";

        // series no hide
        seriesNoRow.style.display="none";

        // journal frequency  hide
        journalFrequencyRow.style.display="none";

        // newspaper edition hide
        newspaperEditionRow.style.display="none";

        // newspaper frequency hide
        newspaperFrequencyRow.style.display="none";

        //SHOW///
        // issn show
        issnRow.style.display="table-row";

        // started year  show
        startedYearRow.style.display="table-row";

        // magazine frequency show
        magazineFrequencyRow.style.display="table-row";

        // volume show
        volumeRow.style.display="table-row";

        // issue no show
        issueNoRow.style.display="table-row";

        //  publication date show
        publicationDateRow.style.display="table-row";

    }
    if(resourceType==="Journal"){
        // author  hide
        authorRow.style.display="none";

        // isbn hide
        isbnRow.style.display="none";

        //edition hide
        editionRow.style.display="none";

        // edition year  hide
        editionYearRow.style.display="none";

        //series hide
        seriesRow.style.display="none";

        // series no hide
        seriesNoRow.style.display="none";

        // magazine frequency  hide
        magazineFrequencyRow.style.display="none";
        // newspaper edition hide
        newspaperEditionRow.style.display="none";

        // newspaper frequency hide
        newspaperFrequencyRow.style.display="none";

        //SHOW///
        // issn show
        issnRow.style.display="table-row";

        // started year  show
        startedYearRow.style.display="table-row";

        // journal frequency show
        journalFrequencyRow.style.display="table-row";

        // volume show
        volumeRow.style.display="table-row";

        // issue no showflex
        issueNoRow.style.display="table-row";

        //  publication date show
        publicationDateRow.style.display="table-row";

    }

        tdCoverImage.innerText=dataOb.coverimage ;
        tdResourceType.innerText= dataOb.resourcetype_id.name;
        tdTitle.innerText=dataOb.title ;
        tdAuthor.innerText=dataOb.author ;
        tdPublicationDate.innerText=dataOb.publicationdate;
        tdLanguage.innerText= dataOb.language_id.name;
        tdDisplayCategory.innerText= dataOb.displaycategory_id.name;
        tdPrice.innerText= dataOb.initialprice;
        tdEdition.innerText=dataOb.edition ;
        tdEditionYear.innerText=dataOb.editionyear ;
        tdStartedYEar.innerText= dataOb.startedyear;
        tdMagazineFrequency.innerText= dataOb.magazinefrequency_id ? dataOb.magazinefrequency_id.name : "";
        tdJournalFrequency.innerText= dataOb.journalfrequency_id ? dataOb.journalfrequency_id.name : "";
        tdVolume.innerText= dataOb.volume;
        tdIssueNo.innerText= dataOb.issueno;
        tdNewspaperEdition.innerText= dataOb.newspaperedition_id ? dataOb.newspaperedition_id.name : "";
        tdNewspaperFrequency.innerText= dataOb.newspaperfrequency_id ? dataOb.newspaperfrequency_id.name : "";
        tdPublihser.innerText=dataOb.publisher ;
        tdIsbn.innerText=dataOb.isbn ;
        tdIssn.innerText= dataOb.issn;
        tdSeries.innerText=dataOb.seriestitle ;
        tdSeriesNo.innerText=dataOb.seriesno ;
        tdDdcNo.innerText=dataOb.ddcno ;
        tdCallNo.innerText=dataOb.callno ;
        tdPages.innerText=dataOb.pages ;
        tdDescription.innerText=dataOb.description ;
        tdBookStatus.innerText= dataOb.bookstatus_id.name;
        tdNote.innerText=dataOb.note ;
}

// print function
const printBook = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Book Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintBook.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const clearFile=()=>{
    imgCoverPhoto.src="/resources/images/bookdefault.png";
    book.coverimage= null;
}
// define function for refresh book form
refreshBookForm=()=>{
    // reset form
    bookForm.reset();
    imgCoverPhoto.src="/resources/images/bookdefault.png";

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    // create empty object
    book=new Object();

    let resourceTypes=ajaxGetrequest("/resourcetype/alldata");
    let languages= ajaxGetrequest("/language/alldata");
    let displayCategories= ajaxGetrequest("displaycategory/alldata");
    let bookStatuses=ajaxGetrequest("bookstatus/alldata");
    let magazineFrequency= ajaxGetrequest("/magazinefrequency/alldata");
    let newspaperEdition= ajaxGetrequest("/newspaperedition/alldata");
    let newspaperFrequency = ajaxGetrequest("/newspaerfrequency/alldata");
    let journalFrequency= ajaxGetrequest("/journalfrequency/alldata");
    let authorNames= ajaxGetrequest("/book/authors");
    let publisherNames= ajaxGetrequest("/book/publishers");
    let series= ajaxGetrequest("/book/series")


    fillDataIntoSelect(selectResourceTypeElement,"Select Resource Type",resourceTypes,"name")
    fillDataIntoSelect(selectLanguageElement,"Select Language",languages,"name")
    fillDataIntoSelect(selectDisplayCategoryElement,"Select Display Category",displayCategories,"name")
    fillDataIntoSelect(selectBookStatusElement,"Select Book Status",bookStatuses,"name")
    fillDataIntoSelect(selectMagazineFrequency,"Select Magazine Frequency",magazineFrequency,"name")
    fillDataIntoSelect(selectNewsPaperEdition,"Select Newspaper Edition", newspaperEdition, "name");
    fillDataIntoSelect(selectNewsPaperFrequency, "Select Newspaper Frequency", newspaperFrequency, "name");
    fillDataIntoSelect(selectJournalFrequency,"Select Journal Frequency", journalFrequency,"name")
    fillDataIntoDataList(authorList , authorNames)
    fillDataIntoDataList(publisherList , publisherNames)
    fillDataIntoDataList(seriesList , series)



    starAuthorRequiredElement.style.display="none";
    issnInputAreaElement.style.display="none";
    starISBNRequiredElement.style.display="none";
    calNoElement.disabled=true;
    startedyearAndFrequencyRow.style.display="none";
    volumeandIssueNoRow.style.display="none";
    publicationDateColumnElement.style.display="none";
    newsPaperEditionandDrequencyRow.style.display="none";

    authorColumnElement.style.display="block";
    editonAndEditionYearRow.style.display="flex";
    isbnInputAreaElement.style.display="block";
    seriesAndSeriesNoRow.style.display="flex";

    setInitial([
        selectResourceType,
        textTitle,
        selectLanguage,
        textAuthor,
        datePublicationDate,
        textEdition,
        textEditionYear,
        textStartedYear,
        selectMagazineFrequency,
        selectJournalFrequency,
        selectNewsPaperEdition,
        selectNewsPaperFrequency,
        textVolume,
        textIssueNo,
        textPublisher,
        textIsbn,
        textIssn,
        textSeries,
        numberSeriesNo,
        textDdcNo,
        textCallNo,
        textPages,
        textDescription,
        selectDisplayCategory,
        //cover image
        selectBookStatus,
        textNote,
        numberInitialprice
    ])

    // auto select status - fill default value for book status- not Available
    selectBookStatusElement.value= JSON.stringify(bookStatuses[1]);
    //set valid color
    selectBookStatusElement.style.borderBottom="2px solid lightgreen";
    // binding to book object
    book.bookstatus_id=bookStatuses[1];
    selectBookStatusElement.disabled=true;
}

// function to check errors
const checkBookFormErrors=()=>{
    let errors="";
    if(book.resourcetype_id==null){
        selectResourceType.style.borderBottom="2px solid pink";
        errors += "Please Select Resource Type.<br>";
    }
    if (book.title == null) {
        textTitle.style.borderBottom = "2px solid pink";
        errors += "Please Enter Title.<br>";
    }
    if(book.language_id==null){
        selectLanguage.style.borderBottom="2px solid pink";
        errors += "Please Select Language.<br>";
    }
    if(book.displaycategory_id==null){
        selectDisplayCategory.style.borderBottom="2px solid pink";
        errors += "Please Select Display Category.<br>";
    }
    if (book.initialprice == null) {
        numberInitialprice.style.borderBottom = "2px solid pink";
        errors += "Please Enter Price.<br>";
    }
    if (book.publisher == null) {
        textPublisher.style.borderBottom = "2px solid pink";
        errors += "Please Enter Publisher.<br>";
    }
    if (book.pages == null) {
        textPages.style.borderBottom = "2px solid pink";
        errors += "Please Enter Pages.<br>";
    }

    if(book.bookstatus_id==null){
        selectBookStatus.style.borderBottom="2px solid pink";
        errors += "Please Select Book Status.<br>";
    }
    if(book.resourcetype_id?.name){
        // author , ddc no , isbn is required for books and reference materials
        if(book.resourcetype_id.name==="Book" || book.resourcetype_id.name==="Reference Material"){
            if (book.author == null) {
                textAuthor.style.borderBottom = "2px solid pink";
                errors += "Please Enter Author Name.<br>";
            }
            if (book.ddcno == null) {
                textDdcNo.style.borderBottom = "2px solid pink";
                errors += "Please Enter DDC No.<br>";
            }
            if (book.isbn == null) {
                textIsbn.style.borderBottom = "2px solid pink";
                errors += "Please Enter ISBN.<br>";
            }

        }
        // magazine frequency , ddc no, publication date , issn is required to magazine
        if(book.resourcetype_id.name==="Magazine"){
            if (book.magazinefrequency_id == null) {
                selectMagazineFrequency.style.borderBottom = "2px solid pink";
                errors += "Please Enter Magazine Frequency.<br>";
            }
            if (book.ddcno == null) {
                textDdcNo.style.borderBottom = "2px solid pink";
                errors += "Please Enter DDC No.<br>";
            }
            if (book.publicationdate == null) {
                datePublicationDate.style.borderBottom = "2px solid pink";
                errors += "Please Enter Publication Date.<br>";
            }
            if (book.issn == null) {
                textIssn.style.borderBottom = "2px solid pink";
                errors += "Please Enter ISSN.<br>";
            }

        }
        // ddc no, publication date , issn is required to journal
        if(book.resourcetype_id.name==="Journal"){

            if (book.ddcno == null) {
                textDdcNo.style.borderBottom = "2px solid pink";
                errors += "Please Enter DDC No.<br>";
            }
            if (book.publicationdate == null) {
                datePublicationDate.style.borderBottom = "2px solid pink";
                errors += "Please Enter Publication Date.<br>";
            }
            if (book.issn == null) {
                textIssn.style.borderBottom = "2px solid pink";
                errors += "Please Enter ISSN.<br>";
            }

        }
        // publication date , newspaper edition, newspaper frequency , issn is required for newspaper
        if(book.resourcetype_id.name==="Newspaper"){
            if (book.publicationdate == null) {
                datePublicationDate.style.borderBottom = "2px solid pink";
                errors += "Please Enter Publication Date.<br>";
            }
            if (book.newspaperedition_id == null) {
                selectNewsPaperEdition.style.borderBottom = "2px solid pink";
                errors += "Please Select Newspaper Edition.<br>";
            }
            if (book.newspaperfrequency_id == null) {
                selectNewsPaperFrequency.style.borderBottom = "2px solid pink";
                errors += "Please Select NewsPaper Frequency.<br>";
            }
            if (book.issn == null) {
                textIssn.style.borderBottom = "2px solid pink";
                errors += "Please Enter ISSN.<br>";
            }

        }
    }


    return errors;
}

// book submit button function
const buttonBookSubmit = () => {
    console.log(book);

    // check form has valid values for required fields
    let formErrors = checkBookFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this book record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons:true

        }).then((result) => {
            if (result.isConfirmed) {
                // call post service
                let postServiceResponse = getHttpServiceRequest("/book/insert", "POST", book);

                if (postServiceResponse == "OK") {
                    // save success
                    Swal.fire({
                        title: "Saved!",
                        text: "Book record saved successfully.",
                        icon: 'success',

                    });
                    refreshBooktable();
                    refreshBookForm();
                    // shift to tab pill table
                    tabpaneForm.classList.remove('show', 'active');
                    tabPaneTable.classList.add('show', 'active');
                    // shift to  table pill tab
                    tabPillForm.classList.remove('show', 'active');
                    tabPillTable.classList.add('show', 'active');

                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Book record could not be saved.</p>
                        <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confirmation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh book form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK"

                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
            }
        })
    } else {
        // form has errors
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has the following errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

// function to check updates
const checkBookFormUpdates=()=>{
    let updates="";

    if(book !=null && oldBook!=null){
        // resource type
        if(book.resourcetype_id.name!=oldBook.resourcetype_id.name){
            updates +="Resource Type is changed "+
                oldBook.resourcetype_id.name+" into "+
                book.resourcetype_id.name +
                ".<br>"
        }
        //title
        if(book.title!=oldBook.title){
            updates +="Title is changed "+
                oldBook.title+" into "+
                book.title +
                ".<br>"
        }
        //language
        if(book.language_id.name!=oldBook.language_id.name){
            updates +="Language is changed "+
                oldBook.language_id.name+" into "+
                book.language_id.name +
                ".<br>"
        }
        //author
        if(book.author!=oldBook.author){
            updates +="Author is changed "+
                oldBook.author+" into "+
                book.author +
                ".<br>"
        }
        //Display category
        if(book.displaycategory_id.name!=oldBook.displaycategory_id.name){
            updates +="Display Category is changed "+
                oldBook.displaycategory_id.name+" into "+
                book.displaycategory_id.name +
                ".<br>"
        }
        //price
        if(book.initialprice!=oldBook.initialprice){
            updates +="Price is changed "+
                oldBook.initialprice+" into "+
                book.initialprice +
                ".<br>"
        }
        //publication date
        if(book.publicationdate!=oldBook.publicationdate){
            updates +="Publication Date is changed "+
                oldBook.publicationdate+" into "+
                book.publicationdate +
                ".<br>"
        }

        //Edition
        if(book.edition!=oldBook.edition){
            updates +="Edition is changed "+
                oldBook.edition+" into "+
                book.edition +
                ".<br>"
        }
        //Edition year
        if(book.editionyear!=oldBook.editionyear){
            updates +="Edition Year is changed "+
                oldBook.editionyear+" into "+
                book.editionyear +
                ".<br>"
        }
        // started year
        if(book.startedyear!=oldBook.startedyear){
            updates +="Started Year is changed "+
                oldBook.startedyear+" into "+
                book.startedyear +
                ".<br>"
        }
        // magazine fequency
        if(book.magazinefrequency_id?.name !== oldBook.magazinefrequency_id?.name){
            updates += "Magazine Frequency is changed " +
                (oldBook.magazinefrequency_id?.name ?? "None") +
                " into " +
                (book.magazinefrequency_id?.name ?? "None") +
                ".<br>";
        }
        // journal frequency
        if(book.journalfrequency_id?.name !== oldBook.journalfrequency_id?.name){
            updates += "Journal Frequency is changed " +
                (oldBook.journalfrequency_id?.name ?? "None") +
                " into " +
                (book.journalfrequency_id?.name ?? "None") +
                ".<br>";
        }

        // volume
        if(book.volume!=oldBook.volume){
            updates +="Volume is changed "+
                oldBook.volume+" into "+
                book.volume +
                ".<br>"
        }
        // issue no
        if(book.issueno!=oldBook.issueno){
            updates +="Issue No is changed "+
                oldBook.issueno+" into "+
                book.issueno +
                ".<br>"
        }
        // newspaper edition
        if(book.newspaperedition_id?.name !== oldBook.newspaperedition_id?.name){
            updates += "Newspaper Edition is changed " +
                (oldBook.newspaperedition_id?.name ?? "None") +
                " into " +
                (book.newspaperedition_id?.name ?? "None") +
                ".<br>";
        }

        //newspaper frequency
        if(book.newspaperfrequency_id?.name !== oldBook.newspaperfrequency_id?.name){
            updates += "Newspaper Frequency is changed " +
                (oldBook.newspaperfrequency_id?.name ?? "None") +
                " into " +
                (book.newspaperfrequency_id?.name ?? "None") +
                ".<br>";
        }

        //publihser
        if(book.publisher!=oldBook.publisher){
            updates +="Publisher is changed "+
                oldBook.publisher+" into "+
                book.publisher +
                ".<br>"
        }
        //isbn or issn
        if(book.isbn!=oldBook.isbn){
            updates +="ISBN is changed "+
                oldBook.isbn+" into "+
                book.isbn +
                ".<br>"
        }
        if(book.issn!=oldBook.issn){
            updates +="ISSN is changed "+
                oldBook.issn+" into "+
                book.issn +
                ".<br>"
        }

        //series
        if(book.seriestitle!=oldBook.seriestitle){
            updates +="Series is changed "+
                oldBook.seriestitle+" into "+
                book.seriestitle +
                ".<br>"
        }
        //series no
        if(book.seriesno!=oldBook.seriesno){
            updates +="Series No is changed "+
                oldBook.seriesno+" into "+
                book.seriesno +
                ".<br>"
        }
        //ddc no
        if(book.ddcno!=oldBook.ddcno){
            updates +="DDC No is changed "+
                oldBook.ddcno+" into "+
                book.ddcno +
                ".<br>"
        }
        //pages
        if(book.pages!=oldBook.pages){
            updates +="No of pages is changed "+
                oldBook.pages+" into "+
                book.pages +
                ".<br>"
        }
        //description
        if(book.description!=oldBook.description){
            updates +="Description is changed "+
                oldBook.description+" into "+
                book.description +
                ".<br>"
        }

        // cover image
        // book status
        if(book.bookstatus_id.name!=oldBook.bookstatus_id.name){
            updates +="Book Status is changed "+
                oldBook.bookstatus_id.name+" into "+
                book.bookstatus_id.name +
                ".<br>"
        }
        if (book.coverimage != oldBook.coverimage) {
            updates +=
                "Cover image is changed.<br>";
        }
        // note
        if(book.note!=oldBook.note){
            updates +="Note is changed "+
                oldBook.note+" into "+
                book.note +
                ".<br>"
        }
    }
    return updates;
}

// define function for update record
const buttonBookUpdate = () => {
    // need to check  all required feild with valid value
    let formErrors = checkBookFormErrors();
    if (formErrors == "") {
        let formUpdates = checkBookFormUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        } else {
            //has updates
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this book record?</p>
            <p>${formUpdates}</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel"

            }).then((result) => {
                if (result.isConfirmed) {
                    let updateServiceResponse = getHttpServiceRequest("/book/update", "PUT", book);


                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Book record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                      refreshBooktable();
                      refreshBookForm();

                        // shift to tab pane table
                        tabpaneForm.classList.remove('show', 'active');
                        tabPaneTable.classList.add('show', 'active');
                        // shift to  table pill tab
                        tabPillForm.classList.remove('show', 'active');
                        tabPillTable.classList.add('show', 'active');

                    } else {
                        // user cancel updates
                        Swal.fire({
                            title: 'Update Failed',
                            html: `<p>Book record could not be updated.</p>
                <p>${updateServiceResponse}</p>`,
                            confirmButtonText: 'OK'
                        });
                    }
                }
            })

        }
    } else {
        // form has errors
        Swal.fire({
            title: 'Update Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};

