<?php
require('fpdf/fpdf.php');

$search = isset($_GET["search"]) ? trim($_GET["search"]) : '';
// echo $search;

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 22);
$pdf->SetMargins(8, 0, 0);
$pdf->SetLineWidth(0.4);

function text($text){
    // Convertir a ISO-8859-1 para soportar caracteres especiales
    return iconv('UTF-8', 'ISO-8859-1', $text);
}


//Header
$pdf->Cell(0, 20, text('Tabla de Tareas'), 0, 1, 'C');
$pdf->Image('img/pdfImage.png', 180, 12, 20, 20, 'PNG');

$pdf->Ln(5);

//Cuerpo - Tabla
//CABECERA
$pdf->SetFontSize(13);
$header = [
    "ID",
    "Nombre",
    "Descripción"
];
foreach($header as $index => $col) {
    $w = $index == 0 ? 30 : 81;
    $pdf->Cell($w,7,text($col),1, 0, 'C');
}
$pdf->Ln();

// DATOS
$pdf->SetFont('Times', '', 10);

$dataUrl = "http://localhost/crud-ajax-fetch/php/listar-tareas.php?search=".$search;
// $options = [
//     "http" => [
//         "method"  => "POST",
//         "header"  => "Content-Type: application/x-www-form-urlencoded",
//         "content" => "search=$search"
//     ]
// ];
// $context = stream_context_create($options);
// $data = file_get_contents($dataUrl, false, $context);
$data = file_get_contents($dataUrl);
$tareas = json_decode($data, true);

foreach($tareas as $tarea)
{
    $indexCampo = 0;
    foreach($tarea as $campo){
        $w = $indexCampo == 0 ? 30 : 81;
        $align = $indexCampo == 0 ? 'C' : '';
        $pdf->Cell($w,6,text($campo),1, 0, $align);
        $indexCampo++;
    }
    $pdf->Ln();
}


//Footer
$pdf->SetY(-15);
$pdf->SetFont('Arial','I',8);
$pdf->Cell(0,-6,text('Creado por Cristopher De la Cruz'),0,0,'C');



$pdf->Output('I', 'TablaTask.pdf', true);
?>
