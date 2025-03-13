<?php 

require('phpSpreadsheet/src/PhpSpreadsheet/Spreadsheet.php');
require 'phpSpreadSheet/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PHPOffice\PhpSpreadsheet\Writer\Xlsx;

$spreadsheet = new Spreadsheet();

$spreadsheet->getProperties()->setCreator('Cristopher De la Cruz');

$spreadsheet->setActiveSheetIndex(0);
$hojaActiva = $spreadsheet->getActiveSheet();

$hojaActiva->setCellValue('B2', 'Hola Gentitaaa');
$hojaActiva->setCellValue('B3', 'Wazaaaa');

$hojaActiva->setCellValue('C2', 'Nya')->setCellValue('C3', 'Nya');

$writer = new Xlsx($spreadsheet);
$writer->save('TaskTable.xlsx');

?>