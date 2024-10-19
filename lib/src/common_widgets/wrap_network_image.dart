import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class WrapNetworkImage extends StatelessWidget {
  const WrapNetworkImage({
    required this.imageUrl,
    super.key,
    this.height,
    this.width,
    this.fit,
  });

  final String imageUrl;
  final double? height;
  final double? width;
  final BoxFit? fit;

  @override
  Widget build(BuildContext context) {
    // return Image.asset(
    //   imageUrl,
    //   height: height ?? double.infinity,
    //   width: width ?? double.infinity,
    //   fit: fit,
    // );
    return CachedNetworkImage(
      imageUrl: imageUrl,
      height: height ?? double.infinity,
      width: width ?? double.infinity,
      fit: fit ?? BoxFit.cover,
      errorWidget: (_, __, ___) => const Center(
        child: Icon(
          Icons.error,
          color: Colors.red,
        ),
      ),
      progressIndicatorBuilder: (context, url, progress) => Center(
        child: CircularProgressIndicator.adaptive(
          value: progress.progress,
        ),
      ),
    );
  }
}
