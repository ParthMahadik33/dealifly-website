<?php
declare(strict_types=1);

function dealifly_redirect(string $status): void
{
    $referer = (string) ($_SERVER['HTTP_REFERER'] ?? '');
    $path = parse_url($referer, PHP_URL_PATH) ?? '';
    $page = (strpos($referer, 'index.html') !== false || $path === '/' || $path === '')
        ? 'index.html'
        : 'contact.html';
    header('Location: ' . $page . '?status=' . rawurlencode($status) . '#contact-form', true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    dealifly_redirect('invalid');
}

// Bots commonly complete hidden fields. Return success without sending mail.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    dealifly_redirect('success');
}

$clean = static function ($value, int $maximumLength): string {
    $value = trim(strip_tags((string) $value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maximumLength)
        : substr($value, 0, $maximumLength);
};

$name = $clean($_POST['name'] ?? '', 100);
$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$company = $clean($_POST['company'] ?? '', 150);
$phone = $clean($_POST['phone'] ?? '', 40);
$message = $clean($_POST['message'] ?? '', 5000);
$serviceKey = $clean($_POST['service'] ?? '', 50);

$services = [
    'linkedin-personal-branding' => 'LinkedIn Personal Branding',
    'ecommerce-growth-marketing' => 'Ecommerce Growth Marketing',
    'company-growth-marketing' => 'Company Growth Marketing',
    'linkedin' => 'LinkedIn Lead Generation',
    'email' => 'Email Marketing Outreach',
    'lead-research' => 'Lead Research',
    'seo-geo' => 'SEO & GEO',
    'content' => 'Content Marketing',
    'brand-identity' => 'Brand Identity',
    'brand-storytelling' => 'Brand Storytelling',
    'growth-program' => 'Growth Program',
];

if ($name === '' || $email === false || $message === '' || !isset($services[$serviceKey])) {
    dealifly_redirect('invalid');
}

$recipient = 'contact@dealifly.com';
$subject = 'New Dealifly enquiry: ' . $services[$serviceKey];
$body = implode("\n", [
    'New enquiry from the Dealifly website',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Company: ' . ($company !== '' ? $company : 'Not provided'),
    'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Service: ' . $services[$serviceKey],
    '',
    'Message:',
    $message,
]);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Dealifly Website <contact@dealifly.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
]);

$sent = @mail($recipient, $subject, wordwrap($body, 78), $headers);
dealifly_redirect($sent ? 'success' : 'error');
