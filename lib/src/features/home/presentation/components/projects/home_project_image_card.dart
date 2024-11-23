import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/wrap_network_image.dart';

class HomeProjectImageCard extends StatelessWidget {
  const HomeProjectImageCard({required this.imageUrl, super.key});
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return WrapNetworkImage(
      imageUrl: imageUrl,
    );
  }
}
