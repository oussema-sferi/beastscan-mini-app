<?php
require_once __DIR__ . '/vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader);

// Render template (no dynamic data yet)
echo $twig->render('index.html.twig', ['title' => 'Voting Page']);