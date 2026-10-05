const selectTypeElement= document.getElementById("selectSearchType");
const textSearchedName = document.getElementById("textSearchedName");
const suggestionList = document.getElementById("bookSuggestionList");
const tableBody= document.getElementById("tableBodyBooks")
const btnSearch = document.getElementById("btnSearch");

selectTypeElement.addEventListener("change",()=>{
    const selectedData= selectTypeElement.value;
    if(selectedData==="Title"){
        textSearchedName.placeholder= "Type Book Title Here"
        let bookTitles= ajaxGetrequest("/book/titles");
        fillDataIntoDataList(suggestionList , bookTitles)
    }
    if(selectedData==="Author"){
        textSearchedName.placeholder= "Type Author Name Here"
        let authorNames= ajaxGetrequest("/book/authors");
        fillDataIntoDataList(suggestionList , authorNames)
    }
    if(selectedData==="ISBN"){
        textSearchedName.placeholder= "Type ISBN Here"
        let isbns= ajaxGetrequest("/book/isbns");
        fillDataIntoDataList(suggestionList , isbns)
    }
    if(selectedData==="ISSN"){
        textSearchedName.placeholder= "Type ISSN Here"
        let issns= ajaxGetrequest("/book/issns");
        fillDataIntoDataList(suggestionList , issns)
    }
    if(selectedData==="Series"){
        textSearchedName.placeholder= "Type Series Name Here"
        let series= ajaxGetrequest("/book/series")
        fillDataIntoDataList(suggestionList , series)
    }
    if(selectedData==="Display Category"){
        textSearchedName.placeholder= "Type Display Category Here"
        let displayCategories= ajaxGetrequest("/book/displaycategories");
        fillDataIntoDataList(suggestionList , displayCategories)
    }
})

btnSearch.addEventListener("click", () => {
    refreshBookstable();
});
textSearchedName.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        refreshBookstable();
    }
});

// define refresh table function
const refreshBookstable = () => {
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableBooks')) {
        $('#tableBooks').DataTable().destroy();
    }
    //data array
    let books = ajaxGetrequest("/bookcopies/alldata");

    const searchType = selectTypeElement.value;
    const searchText = textSearchedName.value;

    // filtering
    if(searchText !== ""){

            if(searchType === "Title"){
                books= ajaxGetrequest("/bookcopies/bytitle/"+ searchText);
            }

            if(searchType === "Author"){
                books= ajaxGetrequest("/bookcopies/byauthor/"+ searchText);
            }

            if(searchType === "ISBN"){
                books= ajaxGetrequest("/bookcopies/byisbn/"+ searchText);
            }

            if(searchType === "ISSN"){
                books= ajaxGetrequest("/bookcopies/byissn/"+ searchText);
            }

            if(searchType === "Series"){
                books= ajaxGetrequest("/bookcopies/byseries/"+ searchText);
            }

            if(searchType === "Display Category"){
                books= ajaxGetrequest("/bookcopies/bydisplaycategory/"+ searchText);
            }

    }

    // property array
    let displayProperty = [
        { propertyName: getResourceType, dataType: "function" },
        { propertyName: "accessionno", dataType: "string" },
        { propertyName: getBookTitle, dataType: "function" },
        { propertyName: getAuthor, dataType: "function" },
        { propertyName: getLanguage, dataType: "function" },
        { propertyName: getDisplaycategory, dataType: "function" },
        { propertyName: getIsReserved, dataType: "function" },
        { propertyName: getBookCopyStatus, dataType: "function" }
    ];

    if(!Array.isArray(books)){
        books = books.content || [];
    }

    //fill data into table function
    fillDataIntoBooksTable(
        tableBody,
        books,
        displayProperty,
        viewBook,
        reserveBook
    );

    $("#tableBooks").DataTable({
        responsive: true,
        autoWidth: false
    });
}

const getResourceType=(dataOb)=>{
    return dataOb.book_id.resourcetype_id.name;
}
const getBookTitle=(dataOb)=>{
    return dataOb.book_id.title;
}
const getAuthor=(dataOb)=>{
    return dataOb.book_id.author;
}
const getLanguage=(dataOb)=>{
    return dataOb.book_id.language_id.name;
}
const getDisplaycategory=(dataOb)=>{
    return dataOb.book_id.displaycategory_id.name;
}
const getIsReserved=(dataOb)=>{
    if(dataOb.isreserved==true){
        return "yes"
    }else{
        return "No"
    }
}

const getBookCopyStatus=(dataOb)=>{
    return dataOb.bookcopystatus_id.name;
}

// define function for book print
const viewBook = (dataOb) => {
    let bookModal_view = new bootstrap.Modal(
        document.getElementById("modalBookView"),
        {}
    );
    bookModal_view.show();
    book = getHttpServiceRequest("/bookcopy/byid/"+ dataOb.id)
    if(dataOb.coverimage){
        tdCoverImage.src= atob(dataOb.coverimage);
    }else{
        tdCoverImage.src="/resources/images/bookdefault.png";
    }

    const resourceType=dataOb.book_id.resourcetype_id.name;

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

    tdCoverImage.innerText=dataOb.book_id.coverimage ;

    tdResourceType.innerText= dataOb.book_id.resourcetype_id.name;

    tdAccessionNo.innerText= dataOb.accessionno;

    tdTitle.innerText=dataOb.book_id.title ;

    tdAuthor.innerText=dataOb.book_id.author ;

    tdPublicationDate.innerText=dataOb.book_id.publicationdate;

    tdLanguage.innerText= dataOb.book_id.language_id.name;

    tdDisplayCategory.innerText= dataOb.book_id.displaycategory_id.name;

    tdEdition.innerText=dataOb.book_id.edition ;

    tdEditionYear.innerText=dataOb.book_id.editionyear ;

    tdStartedYEar.innerText= dataOb.book_id.startedyear;

    tdMagazineFrequency.innerText= dataOb.book_id.magazinefrequency_id ? dataOb.book_id.magazinefrequency_id.name : "";

    tdJournalFrequency.innerText= dataOb.book_id.journalfrequency_id ? dataOb.book_id.journalfrequency_id.name : "";

    tdVolume.innerText= dataOb.book_id.volume;

    tdIssueNo.innerText= dataOb.book_id.issueno;

    tdNewspaperEdition.innerText= dataOb.book_id.newspaperedition_id ? dataOb.book_id.newspaperedition_id.name : "";

    tdNewspaperFrequency.innerText= dataOb.book_id.newspaperfrequency_id ? dataOb.book_id.newspaperfrequency_id.name : "";

    tdPublihser.innerText=dataOb.book_id.publisher ;

    tdIsbn.innerText=dataOb.book_id.isbn ;

    tdIssn.innerText= dataOb.book_id.issn;

    tdSeries.innerText=dataOb.book_id.seriestitle ;

    tdSeriesNo.innerText=dataOb.book_id.seriesno ;

    tdDdcNo.innerText=dataOb.book_id.ddcno ;

    tdCallNo.innerText=dataOb.book_id.callno ;

    tdPages.innerText=dataOb.book_id.pages ;

    // let shelfLocations = getHttpServiceRequest("/shelflocations/bydisplaycategoryid/" + dataOb.book_id.displaycategory_id.id);
    // console.log(shelfLocations);
    // console.log(Array.isArray(shelfLocations));
    // console.log(typeof shelfLocations);
    //
    // if(shelfLocations.length > 0){
    //
    //     let locationCodes = shelfLocations.map(location => location.locationcode).join(", ");
    //
    //     tdShelfLocation.innerText = locationCodes;
    //
    // }else{
    //     tdShelfLocation.innerText = "Not Assigned";
    // }
    //
    // if(dataOb.isreserved==true){
    //     tdBookReserved.innerText= "Yes"
    // }else{
    //     tdBookReserved.innerText= "No"
    // }

    tdBookStatus.innerText= dataOb.book_id.bookstatus_id.name;
}

const reserveBook=(dataOb)=>{
    window.location.replace("/reservation?bookcopyId=" + dataOb.id);
}