var teste = undefined;


document.addEventListener('contextmenu', e => e.preventDefault());


var url = $url();

url = typeof url != "undefined" ? url : false;
var mineN = 15;
var rows = 10;
var cols = 10;

if (url) {
    switch (url.mode[0]) {
        case 'medium':
            rows = 13;
            cols = 15;
            mineN = 20;
            break;
        case 'hard':
            rows = 15;
            cols = 17;
            mineN = 25;
            break;
        case 'custom':
            rows = parseInt(url.rows[0]);
            cols = parseInt(url.cols[0]);
            mineN = parseInt(url.mineN[0]);
            break;
    }
}

$('#btn').click((e) => {
    e.preventDefault();

    rows = $('#rows').val();
    cols = $('#cols').val();
    mineN = $('#mines').val();

    window.location.replace(`?mode=custom&rows=${rows}&cols=${cols}&mineN=${mineN}`);
});



// Cell Class
var Cell = function (id, mine, row, col) {
    this.id = id;
    this.mine = mine;
    this.border = 0;
    this.quantumstate = false;
    this.flag = false;
    this.table = {
        row,
        col,
    };
    this.near = {
        up: this.id - cols,
        upright: this.id - (cols - 1),

        right: this.id + 1,
        downright: this.id + (cols + 1),

        down: this.id + cols,
        downleft: this.id + (cols - 1),

        left: this.id - 1,
        upleft: this.id - (cols + 1)
    };

    //bordercheck
    if ((row == 1 || row == rows) || (col == 1 || col == cols)) {
        this.border = 1;

        if (row == 1) {
            this.near.up = false;
            this.near.upleft = false;
            this.near.upright = false;
        }

        if (row == rows) {
            this.near.down = false;
            this.near.downleft = false;
            this.near.downright = false;
        }

        if (col == 1) {
            this.near.upleft = false;
            this.near.left = false;
            this.near.downleft = false;
        }

        if (col == cols) {
            this.near.upright = false;
            this.near.right = false;
            this.near.downright = false;
        }
    }
}

// create grid
var gridCellId = 0;
var Cells = [];
var Mines = [];
var Flags = [];

for (var i = 0; i < rows; i++) {
    $('#minefield').append("<div class='row'>" + "</div>");
    for (var i2 = 0; i2 < cols; i2++) {
        $('.row').last().append(`
            <div class=col>
                <span mine=false class=gridCell cell-id=${gridCellId}></span>
            </div>
        `);
        Cells[gridCellId] = new Cell(gridCellId, false, i + 1, i2 + 1);
        gridCellId++;
    }
}

//placemines
for (var i3 = 0; i3 < mineN; i3++) {
    var cellN = Math.floor((Math.random() * (rows * cols)));
    Cells[cellN].mine = true;
    Mines[i3] = Cells[cellN].id;
    //green for mines
    //$('span[cell-id=' + cellN + ']').css('background', 'green');
    $('span[cell-id=' + cellN + ']').attr("mine", true);
}

//dinamic css
$(".row").css("width", cols * 33);

var timeoutId = 0;
var hold = false;
var cellid = null;




var calls = 0;
function iSuspectToBeLoopingInfititely() {
calls += 1;
if (calls > 100) { debugger; }
}


// functions?
function chkCell(id) {
    if (id !== false && !Cells[id].quantumstate) {
        return Cells[id].mine;
    } else return false
}




function chkNear(cell) {
    if (cell !== false || typeof cell !== "undefined" || cell != null) {

        try {
            var countNearMines = 0;

             if (!cell.quantumstate) {   
                if (chkCell(cell.near.up)) {
                    countNearMines++;
                }
                if (chkCell(cell.near.upright)) {
                    countNearMines++;
                }

                if (chkCell(cell.near.right)) {
                    countNearMines++;
                }
                if (chkCell(cell.near.downright)) {
                    countNearMines++;
                }

                if (chkCell(cell.near.down)) {
                    countNearMines++;
                }
                if (chkCell(cell.near.downleft)) {
                    countNearMines++;
                }

                if (chkCell(cell.near.left)) {
                    countNearMines++;
                }
                if (chkCell(cell.near.upleft)) {
                    countNearMines++;
                }
               
                if (countNearMines > 0) {
                    $('span[cell-id=' + cell.id + ']').html(countNearMines);
                    $('span[cell-id=' + cell.id + ']').css('background', '#3d3a4c');
                }

                if (countNearMines == 0 && !cell.quantumstate) {
                    $('span[cell-id=' + cell.id + ']').css('background', '#3d3a4c');
                    cell.quantumstate = true;
                    spread(cell);

                }

            }

        } catch (err) {}
    }
}

function spread(cell) {
    if (cell != false || typeof cell !== "undefined" || cell != null) {
        chkNear(Cells[cell.near.up]);
        chkNear(Cells[cell.near.upright]);

        chkNear(Cells[cell.near.right]);
        chkNear(Cells[cell.near.downright]);

        chkNear(Cells[cell.near.down]);
        chkNear(Cells[cell.near.downleft]);

        chkNear(Cells[cell.near.left]);
        chkNear(Cells[cell.near.upleft]);
    }
}







// hold && click events
$(".gridCell").on('mousedown', function () {
    cellid = parseInt($(this).attr('cell-id'));

    timeoutId = setTimeout(() => {
        hold = true;

        //hold handler
        if (!Cells[cellid].quantumstate) {
            if (!Cells[cellid].flag) {
                Cells[cellid].flag = true;
                $('span[cell-id=' + cellid + ']').css('background', 'black');

                Flags.push(cellid);
            } else {
                Cells[cellid].flag = false;
                $('span[cell-id=' + cellid + ']').css('background', '#e74c3c');

                Flags.splice(Flags.indexOf(cellid), 1);
            }
        }
    }, 500);
}).on('mouseup', function () {
    if (!hold && !Cells[cellid].flag) {
        
        //click handler
        //end
        if (Cells[cellid].mine) {
            alert('rip');
            location.reload();
            $('span[cell-id=' + cellid + ']').css('background', '#2ecc71');
        } else {
            chkNear(Cells[cellid]);
        }
        //var cellid = parseInt($(this).attr('cell-id'));
        var mine = $(this).attr('mine');
        console.log(Cells[cellid]);

    }

    clearTimeout(timeoutId);
    hold = false;

    if (Flags.sort().join(',') === Mines.sort().join(',')) {
        alert('GG IZ');
        location.reload();
    }
});






















function $url(url = window.location.search) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {},
        i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

console.log(Mines);