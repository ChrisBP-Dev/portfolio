import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class KnowledgeIcon extends StatelessWidget {
  const KnowledgeIcon({required this.urlSvg, super.key});
  final String urlSvg;

  @override
  Widget build(BuildContext context) {
    const size = 42.0;
    return SvgPicture.network(
      urlSvg,
      height: size,
      width: size,
      placeholderBuilder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
