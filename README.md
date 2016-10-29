# Steganography
## Hack Manchester 2016 Challenge

An entry for the Hack Manchester 2016 GCHQ challenge to create a steganography tool to encode information to be shared online.

>Steganography is a way of placing messages or information within other messages or information, such as digital watermarks or passport biometrics.

>Historically, steganography has been something intelligence agencies have used to send secret messages - from invisible ink, to microdots, to electronic data.

>Steganography is also used by serious criminals to disguise their communications, and GCHQ works to identify and investigate such communications. This challenge will help us test our ability to spot these methods when used for criminal or espionage purposes.

>Attendees who choose GCHQ’s challenge will be asked to develop an innovative online steganography tool. The tool should be able to conceal data, have the capability to publish it online so it doesn’t look out of the ordinary, and then be able to reveal the data if you know what to look out for.

## Requirements

This project use node and ImageMagick:
- https://nodejs.org/en/
- http://www.imagemagick.org/

## Goal

Create an steganography system that can encode and decode a hidden string from within an image.

Desirable qualities:
- Visually imperceptible : changes to the an image before and after should not be noticeable
- Text content : text content should be extractable from the image
- Watermarked : an optional watermark should signify that there is hidden information - for humans only
- Size and scale independent : if an image is resized or rescaled the data should still be retrievable
- Lossy resilient : if an image is compressed using JPEG then information should be retrievable
- Crop independent : if an image is cropped, then information should be still be retrievable
